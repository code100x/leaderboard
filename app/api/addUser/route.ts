import { fetchUserData } from "@/utils/fetchData";
import { supabase } from "@/utils/supabase";


export const POST = async (req: any, res: any) => {
    try {


        const json = await req.json();
        let {data:{username:username, access_token:access_token}}=json

        // GET call to Github using api to verify access_token

        const users = await fetchUserData(access_token);
        // console.log("users:", users)
        if (users.username !== username) {
            return Response.json({ error: "Invalid access_token" })
        }

        // check if user already exists 
        const { data: existingUser, error: fetchError } = await supabase
            .from('Users')
            .select('username')
            .eq('username', username)
        console.log("existingUser:", existingUser, "fetchError:", fetchError)

        if (fetchError) {
            return Response.json({ error: 'Error checking user existence' });
        }

        if (existingUser.length) {
            return Response.json({ error: "User already exists" });
        }

        // insert into Users table

        const { data, error } = await supabase
            .from('Users')
            .insert([
                { username: username, access_token: access_token }
            ])
            .select()

        console.log("data:", data, "error:", error)


        return Response.json({ data: "User added successfully" });
    } catch (error) {
        console.error(error)
        return Response.json({ error: 'Internal Server Error' });
    }
}