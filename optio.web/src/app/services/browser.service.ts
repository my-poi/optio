import { Injectable } from '@angular/core';

@Injectable()
export class BrowserService {
  detect() {
    const detected = this.parseUserAgent(navigator.userAgent);
    if (detected.name !== 'chrome' && detected.name !== 'firefox') alert('Uruchom Optio w przeglądarce Google Chrome lub Mozilla Firefox.');
    if (detected.name === 'chrome' && detected.version < 62) alert('Zaktualizuj przeglądarkę Google Chrome.');
    if (detected.name === 'firefox' && detected.version < 56) alert('Zaktualizuj przeglądarkę Mozilla Firefox.');
  }

  private parseUserAgent(userAgentString: string) {
    const browsers = this.getRules();
    if (!userAgentString) return null;

    const detected = browsers.map((browser: any) => {
      const match = browser.rule.exec(userAgentString);
      let version = match && match[1].split(/[._]/).slice(0, 3);

      if (version && version.length < 3) {
        version = version.concat(version.length === 1 ? [0, 0] : [0]);
      }

      return match && {
        name: browser.name,
        version: version[0] // version.join('.')
      };
    }).filter(Boolean)[0] || null;

    return detected;
  }

  private getRules() {
    return this.buildRules([
      ['edge', /Edge\/([0-9\._]+)/],
      ['yandexbrowser', /YaBrowser\/([0-9\._]+)/],
      ['vivaldi', /Vivaldi\/([0-9\.]+)/],
      ['kakaotalk', /KAKAOTALK\s([0-9\.]+)/],
      ['chrome', /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
      ['phantomjs', /PhantomJS\/([0-9\.]+)(:?\s|$)/],
      ['crios', /CriOS\/([0-9\.]+)(:?\s|$)/],
      ['firefox', /Firefox\/([0-9\.]+)(?:\s|$)/],
      ['fxios', /FxiOS\/([0-9\.]+)/],
      ['opera', /Opera\/([0-9\.]+)(?:\s|$)/],
      ['opera', /OPR\/([0-9\.]+)(:?\s|$)$/],
      ['ie', /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/],
      ['ie', /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],
      ['ie', /MSIE\s(7\.0)/],
      ['bb10', /BB10;\sTouch.*Version\/([0-9\.]+)/],
      ['android', /Android\s([0-9\.]+)/],
      ['ios', /Version\/([0-9\._]+).*Mobile.*Safari.*/],
      ['safari', /Version\/([0-9\._]+).*Safari/]
    ]);
  }

  private buildRules(ruleTuples: any) {
    return ruleTuples.map((tuple: any) => {
      return {
        name: tuple[0],
        rule: tuple[1]
      };
    });
  }
}
