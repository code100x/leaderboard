import { fetchContributors, fetchUserData } from '../../../utils/fetchData';
import { supabase } from '@/utils/supabase';

export const GET = async (req: any, res: any) => {
    try {
        const users = await fetchUsers();
        console.log("users:", users)
        const data = await fetchContributors(users);
        return Response.json(data);
    } catch (error) {
        console.error(error)
        return Response.json({ error: 'Internal Server Error' });
    }
}

export const POST = async (req: any, res: any) => {
try {
    
    //get access_token from req, validate it and add user to Users table
    const json = await req.json();
    let { data: { access_token: access_token } } = json

    const { username: username, avatar: avatar } = await fetchUserData(access_token);

    console.log("username:", username, "avatar:", avatar);

    const { data: existingUser, error: fetchError } = await supabase
        .from('Users')
        .select()
        .eq('username', username)

    console.log("existingUser:", existingUser, "fetchError:", fetchError)
    // console.log("existingUser:", existingUser, "fetchError:", fetchError)

    if (fetchError) {
        return Response.json({ error: 'Error checking user' });
    }

    if (existingUser.length) {
        if (existingUser[0].access_token == access_token) {
            return Response.json({ error: "User already exists" });
        }
        else {
            // old user, update access token

            const { data, error } = await supabase.from('Users').update({ access_token: access_token }).eq('username', username)
            return Response.json({ data: "Access token updated successfully" });
        }
    }
    else {

        // new user
        // insert into Users table

        const { data, error } = await supabase
            .from('Users')
            .insert([
                { username: username, access_token: access_token }
            ])
            .select()

        console.log("data:", data, "error:", error)
        return Response.json({ data: "User added successfully" });
    }

} catch (error) {
    console.error(error);
    return Response.json({ error: 'Internal Server Error' });
}

}

const fetchUsers = async () => {

    let { data: Users, error } = await supabase
        .from('Users')
        .select('*')

    // console.log("Users:", Users) 

    if (error) { console.log('error', error); throw error }
    return Users;
}