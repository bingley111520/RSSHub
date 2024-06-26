import cache from '@/utils/cache';
import got from '@/utils/got';
import { load } from 'cheerio';
import { parseDate } from '@/utils/parse-date';
import timezone from '@/utils/timezone';

const jwc = (link) =>
    cache.tryGet(link, async () => {
        let content, exactDate;
        try {
            const result = await got(link);
            const $ = load(result.data);
            const form = $("form[name='_newscontent_fromname']");
            form.find('h2').remove();
            const exactDateElement = form.find('#author');
            const exactDateStr = exactDateElement.text();
            exactDateElement.remove();
            content = form.html();
            const exactDateText = exactDateStr.match(/^创建时间：(?<date>\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2})/).groups.date;
            exactDate = timezone(parseDate(exactDateText, 'YYYY-MM-DD HH:mm:ss'), +8);
            return { description: content, exactDate };
        } catch {
            return { description: content, exactDate };
        }
    });
export default jwc;
