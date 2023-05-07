import { drizzle } from 'drizzle-orm/node-postgres';
import { InferModel, eq } from 'drizzle-orm'
import { Pool } from 'pg';

import { todos, users } from './../../db/schema';

export async function GET(request: Request) {
    
    type Todo = InferModel<typeof todos>;
    
    const pool = new Pool({
        connectionString: 'postgres://user:password@host:port/db',
    });
    
    const db = drizzle(pool);

    // Joins
    const allTodosWithUsers = await db
        .select({
            id: todos.id,
            todoDescription: todos.todoDesc,
            user: {
                id: users.id,
                fulName: users.fullName,
            },
        })
        .from(todos)
        .leftJoin(users, eq(todos.userId, users.id));

    
    let content = {
        msg: `GET /todo`,
        data: allTodosWithUsers
    }

    return new Response(JSON.stringify(content));
}

export async function PUT(request: Request) {
    
    let  { todoDescription, name }: { todoDescription: string, name: string} = await request.json();
    if (!todoDescription || !name) {
        // send 422 response for incomplete input
    }

    // Insert
    type NewTodo = InferModel<typeof todos, 'insert'>;
    
    const pool = new Pool({
        connectionString: process.env.POSTGRES_URL,
    });
    
    const db = drizzle(pool);

    const newTodo: NewTodo = {
        todoDesc: todoDescription
    };

    const insertedTodos /* : Todo[] */ = await db.insert(todos).values(newTodo).returning();
    const insertedTodo = insertedTodos[0]!;
    
    let content = {
        msg: `PUT /todo ${insertedTodo.id}`
    }

    return new Response(JSON.stringify(content));
}