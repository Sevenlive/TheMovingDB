import db from './database';
import type { Box, Item, DashboardStats } from './types';

const PORT = process.env.PORT || 3000;

// Helper function to parse JSON body
async function parseBody(req: Request): Promise<any> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Dashboard stats
      if (path === '/api/dashboard' && method === 'GET') {
        const totalBoxes = db.prepare('SELECT COUNT(*) as count FROM boxes').get() as { count: number };
        const totalItems = db.prepare('SELECT COUNT(*) as count FROM items').get() as { count: number };
        
        const boxesByLocation = db.prepare(`
          SELECT location, COUNT(*) as count 
          FROM boxes 
          GROUP BY location
        `).all() as Array<{ location: string; count: number }>;
        
        const itemsByLocation = db.prepare(`
          SELECT 
            COALESCE(b.location, 'unassigned') as location,
            COUNT(*) as count
          FROM items i
          LEFT JOIN boxes b ON i.box_id = b.id
          GROUP BY b.location
        `).all() as Array<{ location: string; count: number }>;

        const stats: DashboardStats = {
          totalBoxes: totalBoxes.count,
          totalItems: totalItems.count,
          boxesByLocation: {
            old_home: 0,
            new_home: 0,
            storage: 0,
          },
          itemsByLocation: {
            old_home: 0,
            new_home: 0,
            storage: 0,
            unassigned: 0,
          },
        };

        boxesByLocation.forEach(row => {
          if (row.location in stats.boxesByLocation) {
            stats.boxesByLocation[row.location as keyof typeof stats.boxesByLocation] = row.count;
          }
        });

        itemsByLocation.forEach(row => {
          if (row.location in stats.itemsByLocation) {
            stats.itemsByLocation[row.location as keyof typeof stats.itemsByLocation] = row.count;
          }
        });

        return new Response(JSON.stringify(stats), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Boxes endpoints
      if (path === '/api/boxes' && method === 'GET') {
        const search = url.searchParams.get('search');
        const location = url.searchParams.get('location');
        
        let query = 'SELECT * FROM boxes WHERE 1=1';
        const params: any[] = [];
        
        if (search) {
          query += ' AND (label LIKE ? OR room LIKE ? OR CAST(number AS TEXT) LIKE ?)';
          params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }
        
        if (location) {
          query += ' AND location = ?';
          params.push(location);
        }
        
        query += ' ORDER BY number ASC';
        
        const boxes = db.prepare(query).all(...params);
        return new Response(JSON.stringify(boxes), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (path === '/api/boxes' && method === 'POST') {
        const body = await parseBody(req);
        if (!body || !body.label || !body.number || !body.room) {
          return new Response(JSON.stringify({ error: 'Missing required fields' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const stmt = db.prepare(`
          INSERT INTO boxes (label, number, room, location)
          VALUES (?, ?, ?, ?)
        `);
        
        const result = stmt.run(
          body.label,
          body.number,
          body.room,
          body.location || 'old_home'
        );

        const box = db.prepare('SELECT * FROM boxes WHERE id = ?').get(result.lastInsertRowid);
        return new Response(JSON.stringify(box), {
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (path.match(/^\/api\/boxes\/\d+$/) && method === 'GET') {
        const id = path.split('/').pop();
        const box = db.prepare('SELECT * FROM boxes WHERE id = ?').get(id);
        
        if (!box) {
          return new Response(JSON.stringify({ error: 'Box not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify(box), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (path.match(/^\/api\/boxes\/\d+$/) && method === 'PUT') {
        const id = path.split('/').pop();
        const body = await parseBody(req);
        
        if (!body) {
          return new Response(JSON.stringify({ error: 'Invalid request body' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const stmt = db.prepare(`
          UPDATE boxes 
          SET label = COALESCE(?, label),
              number = COALESCE(?, number),
              room = COALESCE(?, room),
              location = COALESCE(?, location),
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `);
        
        stmt.run(body.label, body.number, body.room, body.location, id);
        const box = db.prepare('SELECT * FROM boxes WHERE id = ?').get(id);
        
        return new Response(JSON.stringify(box), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (path.match(/^\/api\/boxes\/\d+$/) && method === 'DELETE') {
        const id = path.split('/').pop();
        db.prepare('DELETE FROM boxes WHERE id = ?').run(id);
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Items endpoints
      if (path === '/api/items' && method === 'GET') {
        const search = url.searchParams.get('search');
        const boxId = url.searchParams.get('box_id');
        const category = url.searchParams.get('category');
        
        let query = 'SELECT * FROM items WHERE 1=1';
        const params: any[] = [];
        
        if (search) {
          query += ' AND (name LIKE ? OR description LIKE ? OR category LIKE ?)';
          params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }
        
        if (boxId) {
          query += ' AND box_id = ?';
          params.push(boxId);
        }
        
        if (category) {
          query += ' AND category = ?';
          params.push(category);
        }
        
        query += ' ORDER BY name ASC';
        
        const items = db.prepare(query).all(...params);
        return new Response(JSON.stringify(items), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (path === '/api/items' && method === 'POST') {
        const body = await parseBody(req);
        if (!body || !body.name) {
          return new Response(JSON.stringify({ error: 'Missing required fields' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const stmt = db.prepare(`
          INSERT INTO items (name, description, category, condition, box_id)
          VALUES (?, ?, ?, ?, ?)
        `);
        
        const result = stmt.run(
          body.name,
          body.description || null,
          body.category || null,
          body.condition || null,
          body.box_id || null
        );

        const item = db.prepare('SELECT * FROM items WHERE id = ?').get(result.lastInsertRowid);
        return new Response(JSON.stringify(item), {
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (path.match(/^\/api\/items\/\d+$/) && method === 'GET') {
        const id = path.split('/').pop();
        const item = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
        
        if (!item) {
          return new Response(JSON.stringify({ error: 'Item not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify(item), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (path.match(/^\/api\/items\/\d+$/) && method === 'PUT') {
        const id = path.split('/').pop();
        const body = await parseBody(req);
        
        if (!body) {
          return new Response(JSON.stringify({ error: 'Invalid request body' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const stmt = db.prepare(`
          UPDATE items 
          SET name = COALESCE(?, name),
              description = COALESCE(?, description),
              category = COALESCE(?, category),
              condition = COALESCE(?, condition),
              box_id = ?,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `);
        
        stmt.run(
          body.name,
          body.description,
          body.category,
          body.condition,
          body.box_id !== undefined ? body.box_id : null,
          id
        );
        
        const item = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
        
        return new Response(JSON.stringify(item), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (path.match(/^\/api\/items\/\d+$/) && method === 'DELETE') {
        const id = path.split('/').pop();
        db.prepare('DELETE FROM items WHERE id = ?').run(id);
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get items by box
      if (path.match(/^\/api\/boxes\/\d+\/items$/) && method === 'GET') {
        const id = path.split('/')[3];
        const items = db.prepare('SELECT * FROM items WHERE box_id = ? ORDER BY name ASC').all(id);
        
        return new Response(JSON.stringify(items), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // 404 for unknown routes
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error: any) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
});

console.log(`🚀 Server running at http://localhost:${PORT}`);