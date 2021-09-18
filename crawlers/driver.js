import puppeteer from "puppeteer";

class Browser {
    constructor() {
        this.initalized = false;
        this.init();
    }

    async init() {
        this.initalizing = true;
        this.browser = await puppeteer.launch({ headless: false, defaultViewport: null });
        this.currentPage = await this.browser.newPage();
        this.currentPage.setUserAgent(
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36"
        );
        this.initalized = true;
    }

    waitForInit() {
        const self = this;
        return new Promise((resolve, _reject) => {
            setTimeout(() => {
                if (self.initalized) resolve();
                else resolve(self.waitForInit());
            }, 1000);
        });
    }

    async wait(sec) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 1000 * sec);
        });
    }

    async browse(url) {
        await this.currentPage.goto(url);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 1000 * 2);
        });
    }

    async setCookies(cookies) {
        await this.currentPage.setCookie(...cookies);
    }

    async getFullHTML() {
        return await this.currentPage.evaluate(() => document.querySelector("*").outerHTML);
    }

    async xpath(x) {
        return await this.currentPage.$x(x);
    }

    extractTextFromNodes(nodes) {
        const self = this;
        return nodes.map((node) => {
            return self.currentPage.evaluate((el) => {
                return el.textContent;
            }, node);
        });
    }

    extractHrefLinksFromNodes(nodes) {
        const self = this;
        return nodes.map((node) => {
            return self.currentPage.evaluate((el) => {
                return el.getAttribute("href");
            }, node);
        });
    }

    async end() {
        await this.browser.close();
        this.initalized = false;
    }
}

export default Browser;
