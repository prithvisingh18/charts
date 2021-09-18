import Browser from "./driver.js";
import fs from "fs";

export default class StudyDE extends Browser {
    output = [];
    async setCookie(url) {
        await this.init();
        await this.waitForInit();
        await this.browse(url);
        await this.setCookies([
            {
                name: "DaadCookieConsent",
                value: '{"availableCookies":["google-analytics","sticky-alert","session","daad-cookie-consent"],"acceptedCookies":["google-analytics","sticky-alert","session","daad-cookie-consent"],"lastUpdated":1630756263997}',
            },
        ]);
    }

    async scrape(url) {
        await this.browse(url);
        let heads = await this.xpath('//div[@id="course-list"]/ul/li//h3');
        heads = await Promise.all(this.extractTextFromNodes(heads));

        let data = await this.xpath('//div[@id="course-list"]/ul/li//table/tbody/tr[2]/td[2]');
        data = await Promise.all(this.extractTextFromNodes(data));

        heads = heads.map((head, index) => {
            let d = head.split("•");
            return {
                course: d[0],
                uni: d[1],
                city: d[2],
                fees: data[index],
            };
        });
        console.log(
            "-------------------------------------------------------------------------\n",
            heads
        );
        this.output = [...this.output, ...heads];
    }

    async crawl() {
        let pageNo = 1;
        let url = `https://www.study-in-germany.de/en/plan-your-studies/find-programme-and-university/?a=result&q=&degree=37&subjects%5B193%5D=193&studyareas%5B226%5D=226&courselanguage=1&locations=&universities%5B1%5D=1&universities%5B2%5D=1&admissionsemester=S%2CSW&sort=town&page=${pageNo}`;
        await this.setCookie(url);

        for (let i = 1; i <= 39; i++) {
            url = `https://www.study-in-germany.de/en/plan-your-studies/find-programme-and-university/?a=result&q=&degree=37&subjects%5B193%5D=193&studyareas%5B226%5D=226&courselanguage=1&locations=&universities%5B1%5D=1&universities%5B2%5D=1&admissionsemester=S%2CSW&sort=town&page=${i}`;
            await this.scrape(url);
        }
        fs.writeFileSync("output.json", JSON.stringify(this.output));

        await this.end();
    }
}
