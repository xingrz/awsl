import type { ComponentInternalInstance } from 'vue';
import { registerModule } from '@/module';
import { onMounted } from '@/hooks';
import { $, $$, append, create, on, style } from '@/utils/dom';

interface IPic {
  url: string;
  geo: { width: number; height: number };
  large: { url: string };
  pid: string;
  focus_point?: {
    width: number;
    height: number;
    left: number;
    top: number;
  };
  type: string;
}

interface IFeedPictureProps {
  pics: IPic[];
  pic_num: number;
  isMask: boolean;
}

registerModule({
  id: 'expand_pics',
  name: '自动展开超过9张的图片',
  defaultEnabled: true,
  setup() {
    onMounted('FeedPicture', (instance) => {
      const el = instance.vnode.el as HTMLElement | null;
      if (!el) return;

      const props = instance.props as unknown as IFeedPictureProps;
      if (props.pic_num <= 9) return;

      const mask = $<HTMLElement>(el, '[class*="_mask_"]');
      if (!mask) return;

      // The actual flex wrap container is the first child of the picture row
      const wrap = el.firstElementChild as HTMLElement | null;
      if (!wrap) return;

      // Extract class names from existing items to match styling
      const refItem = $<HTMLElement>(wrap, '[class*="_item_"]');
      const refPic = $<HTMLElement>(wrap, '[class*="_pic_"]');
      const refImg = $<HTMLElement>(wrap, 'img');
      const itemClasses = refItem?.className.split(' ').filter(c => c) ?? [];
      const picClasses = refPic?.className.split(' ').filter(c => c) ?? [];
      const imgClasses = refImg?.className.split(' ').filter(c => c) ?? [];

      on(mask, 'mouseenter', () => {
        style(mask, { 'display': 'none' });
        expandPics(wrap, props.pics, instance, itemClasses, picClasses, imgClasses);
        window.dispatchEvent(new Event('resize'));
      });

      on(el, 'mouseleave', () => {
        style(mask, { 'display': '' });
        for (const item of $$(wrap, '.awsl-picbox-item')) {
          item.remove();
        }
        window.dispatchEvent(new Event('resize'));
      });
    });
  },
});

function expandPics(
  wrap: HTMLElement,
  pics: IPic[],
  instance: ComponentInternalInstance,
  itemClasses: string[],
  picClasses: string[],
  imgClasses: string[],
): void {
  const extraPics = pics.slice(9);

  for (const [idx, pic] of extraPics.entries()) {
    const inlineBlock = append(wrap, () => create<HTMLElement>('div', [
      'awsl-picbox-item',
      ...itemClasses,
    ], {
      style: {
        'padding-left': '0.25rem',
        'padding-top': '0.25rem',
      },
    }));

    const square = append(inlineBlock, () => create('div', picClasses));

    const img = create('img', imgClasses, {
      attrs: { 'src': pic.url },
      events: {
        click: (e) => {
          instance.emit('pictureTap', {
            index: 9 + idx,
            pics,
          }, e, e.target);
        },
      },
    });

    append(square, () => create('div', ['woo-picture-hoverMask']));
    append(square, () => create('div', ['woo-picture-slot'], {}, [() => img]));
  }
}
