import Browser from "./driver.js";
import fs from "fs";
import _ from "lodash";
import readline from "readline";

export default class LinkedIn extends Browser {
    output = [];
    // async setCookie(url) {
    //     await this.setCookies([
    //         { name: "lang", value: "v=2&lang=en-us" },
    //         {
    //             name: "bcookie",
    //             value: '"v=2&bb87f129-567f-4f28-8e20-5e4bc67beb84"',
    //         },
    //         { name: "g_state", value: '{"i_l":0}' },
    //         { name: "JSESSIONID", value: '"ajax:3787726652039209335"' },
    //         { name: "liap", value: "true" },
    //         {
    //             name: "lidc",
    //             value: '"b=OB37:s=O:r=O:a=O:p=O:g=3419:u=829:x=1:i=1630839646:t=1630843137:v=2:sig=AQGpMwFEMSDu_OXOGo0zqiQI9KOtkY4L"',
    //         },
    //         { name: "timezone", value: "Asia/Calcutta" },
    //         {
    //             name: "spectroscopyId",
    //             value: "b05e76da-9ab7-431c-ab69-c2e803d07298",
    //         },
    //         {
    //             name: "UserMatchHistory",
    //             value: "AQJPV4iVY6VjIAAAAXu1nnPGUdXfeqh1sk3W2JwF1-MxSulxjd8rZlg2K8HGQZ3HiGU0MeE9Hww0KKgXETaYo_F7t47TJnroSNoYOKVlDa9MDNu76GEMjH19_h3RBssHaxZIYCOA_ICS_81dkR86jXotjEFAS3lyC8Y8xf_3LBoqLMjEDseUAAzBOFp_V5_rWUhtPmdFb6r-t889mCuNbvKMU-8QoM3GkS69XsncEJYD1J3pFLsiYNhLa5PjRAQl9Pa752IL4w",
    //         },
    //     ]);
    // }

    async awaitUserLogin() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        let ans = await new Promise((resolve) =>
            rl.question("Waiting for login ...", (ans) => {
                rl.close();
                resolve(ans);
            })
        );
        if (ans === "y" || ans === "yes") {
            return true;
        }
        return false;
    }

    async scrape(url, city) {
        await this.browse(url);
        await this.wait(5);
        let jobsCount = await this.xpath(
            '//div[@class="jobs-search-results-list__title-heading"]/small'
        );
        jobsCount = await Promise.all(this.extractTextFromNodes(jobsCount));
        jobsCount = jobsCount.map((el) => el.replace("\n", "").replace("results", "").trim());
        for (let i = 0; i < this.output.length; i++) {
            if (city === this.output[i]["city"]) {
                this.output[i]["linkedin_jobs"] = jobsCount[0];
                console.log(this.output[i]);
            }
        }
        console.log(`${city}, ${jobsCount[0]}`);
    }

    async crawl() {
        await this.init();
        await this.waitForInit();

        // await this.browse("https://www.linkedin.com");
        // await this.setCookie();

        await this.browse("https://www.linkedin.com");
        let loginSuccess = await this.awaitUserLogin();
        if (!loginSuccess) {
            await this.end();
            process.exit();
        }

        let data = fs.readFileSync("./output.json");
        data = JSON.parse(data);
        this.output = data;
        let cities = _.uniqBy(data, "city").map((el) => el.city);

        for (let i = 0; i <= cities.length; i++) {
            let url = `https://www.linkedin.com/jobs/search/?distance=10&keywords=software%20engineer&location=${cities[i]}`;
            await this.scrape(url, cities[i]);
        }
        fs.writeFileSync("output_with_jobs.json", JSON.stringify(this.output));

        await this.end();
    }
}
