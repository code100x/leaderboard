import { fetchContributors } from '../../../utils/fetchData';
import { supabase } from '@/utils/supabase';

export const GET = async (req: any, res: any) => {
    try {
        const users = await fetchUsers();
        // console.log("users:", users)
        const data = await fetchContributors(users);
        return Response.json(data);
    } catch (error) {
        console.error(error)
        return Response.json({ error: 'Internal Server Error' });
    }
}

export const fetchUsers = async () => {

    let { data: Users, error } = await supabase
        .from('Users')
        .select('*')

    console.log("Users:", Users)

    if (error) console.log('error', error)
    return Users;
}