import { fetchContributionData } from "@/utils/fetchData";
import { supabase } from "@/utils/supabase"

export const GET = async (req: any, res: any) => {

    let contributorsData: { username: string; totalPRs: number; mergedPRs: number; openPRs: number; issues: number; avatar?: string }[] = []

    // cron.schedule('* * * * *', async () => {

        console.log('')
        console.log('#########################################')
        console.log('#                                       #')
        console.log('# Refreshing contributions every minute #')
        console.log('#                                       #')
        console.log('#########################################')
        console.log('')
        const users = await fetchUsers();

        const usernames = users?.map((user: any) => user.username) || [];

        console.log("usernames:", usernames);

        for (let i = 0; i < usernames.length; i++) {
            const contributionData = await fetchContributionData(usernames[i]);
            if(!contributionData) continue;
            // Check if the username already exists in the database
            const { data: existingUser, error: fetchError } = await supabase
                .from('contributions')
                .select('*')
                .eq('username', contributionData.username)
            
                console.log("existingUser:", existingUser, "fetchError:", fetchError);


            if (fetchError) {
                console.error("Fetch error:", fetchError);
                continue; // Skip to the next username if there's an error
            }

            if (existingUser.length) {
                console.log("Update existing user: ", contributionData.username);
                await supabase
                    .from('contributions')
                    .update(contributionData)
                    .eq('username', contributionData.username);
            } else {

                console.log("Insert new user: ", contributionData.username);
                contributorsData.push(contributionData);
            }
        }

        console.log("contributorsData:", contributorsData);

        // Upsert only new contributors
        const updatedContributions = await supabase.from('contributions').upsert(contributorsData);
        if (updatedContributions.error)
            console.error("updatedContributions error:", updatedContributions.error)
    // });
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

import { NextResponse } from "next/server";

import cron from 'node-cron';

export async function POST(req: any, res: any) {

    try {



        await fetch('/api/refreshDB', { method: "GET" });



        return NextResponse.json({ data: 'Success', status: 200 });

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error }, { status: 500 })
    }

}