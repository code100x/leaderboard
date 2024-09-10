import { fetchContributors, fetchUserData } from '../../../utils/fetchData';
import { supabase } from '@/utils/supabase';

export const GET = async (req: any, res: any) => {
    try {
        const data = await fetchContributions();
        return Response.json(data);
    } catch (error) {
        console.error(error)
        return Response.json({ error: 'Internal Server Error' });
    }
}


async function fetchContributions() {

    let { data, error } = await supabase
        .from('contributions')
        .select('*')

    if(error){
        console.error('error', error);
        return [];
        // throw error
    }

    // data should be { username: username, totalPRs: totalPrs, mergedPRs: mergedPRs, openPRs: openPRs, issues: issueCount, avatar:avatar_url };
    console.log(data)
    return data;   
}

export const POST = async (req: any, res: any) => {
    try {

        //get access_token from req, validate it and add user to Users table
        const json = await req.json();
        let { data: { access_token: access_token } } = json

        const { username: username, avatar: avatar }: { username: string; avatar: string } = await fetchUserData(access_token);

        console.log("username:", username, "avatar:", avatar);

        if (!(username && avatar)) {
            throw Error("Invalid username or avatar");
        }

        // new user
        // insert into Users table

        const { data, error } = await supabase
            .from('Users')
            .insert([
                { username: username, avatar: avatar }
            ])
            .select()

        console.log("data:", data, "error:", error)
        return Response.json({ data: "User added successfully" });

    } catch (error) {
        console.error(error);
        return Response.json({ error: 'Internal Server Error' });
    }

}
