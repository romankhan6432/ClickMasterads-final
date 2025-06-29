import { NextRequest, NextResponse } from 'next/server';
 
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
 
 
// GET /api/admin/roles
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        /* const roles = await prisma.role.findMany({
            include: {
                permissions: true
            }
        }); */

        //return NextResponse.json({ data: roles });
    } catch (error) {
        console.error('Error fetching roles:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/admin/roles
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { name, description, permissions } = await request.json();

        if (!name || !description || !permissions) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const role = "" /*  await prisma.role.create({
            data: {
                name,
                description,
                permissions: {
                    connect: permissions.map((id: string) => ({ id }))
                }
            },
            include: {
                permissions: true
            }
        }); */

        return NextResponse.json({ data: role }, { status: 201 });
    } catch (error) {
        console.error('Error creating role:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT /api/admin/roles/:id
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { name, description, permissions } = await request.json();
        const roleId = request.url.split('/').pop();

        if (!roleId || !name || !description || !permissions) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        /* const role = await prisma.role.update({
            where: { id: roleId },
            data: {
                name,
                description,
                permissions: {
                    set: permissions.map((id: string) => ({ id }))
                }
            },
            include: {
                permissions: true
            }
        });

        return NextResponse.json({ data: role }); */
    } catch (error) {
        console.error('Error updating role:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE /api/admin/roles/:id
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const roleId = request.url.split('/').pop();

        if (!roleId) {
            return NextResponse.json({ error: 'Role ID is required' }, { status: 400 });
        }

      /*   await prisma.role.delete({
            where: { id: roleId }
        }); */

        return NextResponse.json({ message: 'Role deleted successfully' });
    } catch (error) {
        console.error('Error deleting role:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}