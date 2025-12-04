import { registerModule } from '@/module';
import { $, attrs, on } from '@/utils/dom';
import { VueHTMLElement, WithStore } from '@/utils/vue';

interface IApp {
  config?: {
    uid: number;
  }
}

interface IFeedGroup {
  api: string;
  apipath: string;
  count: number;
  frequency: number;
  gid: string;
  icon: string;
  name: string;
  title: string;
  type: string;
  uid: string;
}

interface IFeed {
  feedGroup: {
    left?: IFeedGroup[];
    custom?: IFeedGroup[];
  };
}

type IAppElement = VueHTMLElement<IApp & WithStore<'feed', IFeed>>;

registerModule({
  id: 'logo_click',
  name: '点击 LOGO 进入「最新微博」',
  defaultEnabled: true,
  init() {
    const app = $<IAppElement>(document, '#app:not([awsl-logoclick="yes"])');
    if (!app) return;
    attrs(app, { 'awsl-logoclick': 'yes' });

    const vue = app.__vue__;
    if (!vue) return;

    const uid = vue.config?.uid;
    if (!uid) return;

    const oldLogo = $<HTMLElement>(app, '.Nav_logoWrap_2fPbO');
    if (!oldLogo) return;
    const oldLogoHTML = oldLogo.outerHTML;
    oldLogo.outerHTML = oldLogoHTML; // Recreate logo element to remove existing event listeners

    const newLogo = $<HTMLElement>(app, '.Nav_logoWrap_2fPbO')!;

    attrs(newLogo, {
      'href': `/mygroups?gid=11000${uid}`,
    });

    on(newLogo, 'click', (e) => {
      e.preventDefault();

      vue.$router.push({
        name: 'mygroups',
        query: { gid: `11000${uid}` },
      });

      // Ensure timeline is reloaded
      if (vue.$store.state.feed.feedGroup.left) {
        const curIndex = 1;
        const navItem = vue.$store.state.feed.feedGroup.left[curIndex];
        vue.$Bus.$emit('handleHomeNav', navItem, curIndex, 'left');
      }
    });
  }
});
