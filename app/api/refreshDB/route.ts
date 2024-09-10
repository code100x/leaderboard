import { fetchContributionData } from "@/utils/fetchData";
import { supabase } from "@/utils/supabase"



export const GET = async (req: any, res: any) => {

    const users = await fetchUsers();


    const usernames = users?.map((user: any) => user.username) || [];

    console.log("usernames:", usernames);
    let contributorsData = []

    for (let i = 0; i < usernames.length; i++) {
        contributorsData.push(await fetchContributionData(usernames[i]));
    }

    console.log("contributorsData:", contributorsData);

    await supabase.from('contributions').upsert(contributorsData);


    return Response.json(contributorsData);
}


const fetchUsers = async () => {

    let { data: Users, error } = await supabase
        .from('Users')
        .select('*')

    // console.log("Users:", Users) 

    if (error) { console.log('error', error); return [] }
    return Users;
}