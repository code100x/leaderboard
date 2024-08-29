// const serverHeaders = {
//     Accept: 'application/vnd.github.text-match+json',
//     Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
// }

export async function fetchUserData(access_token: string) {
    const userHeaders = {
        Accept: 'application/vnd.github.text-match+json',
        Authorization: `Bearer ${access_token}`,
    };

    const userData = await fetch(`https://api.github.com/user`, { headers: userHeaders });
    const data = await userData.json();
    const username = data.login;
    const avatar = data.avatar_url;
    return ({ username: username, avatar: avatar });
}

export async function fetchContributionData(username: string, access_token: string) {
    try {
        const userHeaders = {
            Accept: 'application/vnd.github.text-match+json',
            Authorization: `Bearer ${access_token}`,
        };

        // console.log("userHeader:", userHeaders.Authorization, "serverHeader:", serverHeaders.Authorization);

        const { username, avatar } = await fetchUserData(access_token);

        const prs = await fetch(`https://api.github.com/search/issues?q=author:${username}%20type:pr`, { headers: userHeaders });
        const prData = await prs.json();

        // Validation check for PR data
        if (!prData || !prData.items) {
            throw new Error("Invalid PR data received");
        }

        const totalPrs = prData.total_count;
        const mergedPRs = prData.items.filter((item: any) => item.pull_request?.merged_at !== null).length; // Optional chaining
        const openPRs = prData.items.filter((x: any) => x.state === "open").length;

        const issuesData = await fetch(`https://api.github.com/search/issues?q=author:${username}%20type:issue`, { headers: userHeaders });
        const issues = await issuesData.json();

        // Validation check for issues data
        if (!issues || typeof issues.total_count !== 'number') {
            throw new Error("Invalid issues data received");
        }

        const issueCount = issues.total_count;

        return { username: username, avatar: avatar, totalPRs: totalPrs, mergedPRs: mergedPRs, openPRs: openPRs, issues: issueCount };

    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

export async function fetchContributors(contributors: any) {
    console.log("contributors:", contributors);
    const contributorsData = await Promise.all(
        contributors.map(async (contributor: { username: string; access_token: string }) => {
            const contributions = await fetchContributionData(contributor.username, contributor.access_token);
            return contributions;
        })
    );
    return contributorsData;
}
