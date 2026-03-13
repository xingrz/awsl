import { registerModule } from '@/module';
import { onMounted } from '@/hooks';
import { $, append, attrs, create, insertBefore } from '@/utils/dom';
import type { IFeed } from '@/utils/weibo';

registerModule({
  id: 'source_remark',
  name: '优化来源显示',
  defaultEnabled: true,
  setup() {
    // 信息流一级作者
    onMounted('Feed', (instance) => {
      const el = instance.vnode.el as HTMLElement | null;
      if (!el) return;

      const data = (instance.props as { data: IFeed }).data;
      if (!data) return;

      const container = $<HTMLElement>(el, '[class*="_info_"] [class*="_from_"] > .woo-box-flex:not([awsl-source-remark="yes"])');
      if (!container || $(container, '[class*="_ip_"]')) return;

      const source = $<HTMLElement>(container, '[class*="_source_"]');
      if (source && data.region_name) {
        insertBefore(container, source, () => create('div', [
          '_ip_1tpft_41',
        ], {
          html: data.region_name,
          attrs: { title: data.region_name },
        }));
      }

      attrs(container, { 'awsl-source-remark': 'yes' });
    });

    // 转发内容的原作者
    onMounted('FeedContent', (instance) => {
      const el = instance.vnode.el as HTMLElement | null;
      if (!el || !el.classList.contains('retweet')) return;

      const data = (instance.props as { data: IFeed }).data;
      if (!data) return;

      const container = $<HTMLElement>(el, '[class*="_retweetHeadInfo_"] [class*="_from_"] > .woo-box-flex:not([awsl-source-remark="yes"])');
      if (!container) return;

      if (data.region_name) {
        append(container, () => create('div', [
          '_ip_1tpft_41',
        ], {
          html: data.region_name,
          attrs: { title: data.region_name },
        }));
      }

      if (data.source) {
        append(container, () => create('div', [
          '_cut_1tpft_29',
          '_source_1tpft_46',
        ], {
          html: `来自 ${data.source}`,
          attrs: { title: `来自 ${data.source}` },
        }));
      }

      attrs(container, { 'awsl-source-remark': 'yes' });
    });
  },
});
