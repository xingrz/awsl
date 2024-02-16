import { $$, append, attrs, create, observe, on } from '../utils/dom';
import { INode, VueHTMLElement } from '../utils/vue';

interface IPictureBox {
  $attrs: {
    content: unknown;
  };
  $emit: (type: string, ...args: unknown[]) => void;
  pic_num: number;
  pics: {
    focus_point: undefined | {
      width: number;
      height: number;
      left: number;
      top: number;
    };
    geo: {
      width: number;
      height: number;
    };
    pid: string;
    type: 'pic';
    url: string;
  }[];
}

observe(document.body, function expandPics(): void {
  const containers = $$(document, '.picture_inlineNum3_3P7k1:not([awsl-picbox="yes"])');
  for (const el of containers) {
    const container = el as VueHTMLElement<INode<IPictureBox>>;
    attrs(container, { 'awsl-picbox': 'yes' });

    const vue = container.__vue__;
    const context = vue?.$vnode.context;
    if (!context) {
      continue;
    }

    const pics = context.pics.slice(9);
    if (pics.length == 0) return;

    for (const mask of $$(container, '.picture_mask_20G3v')) {
      mask.remove();
    }

    for (const [idx, pic] of pics.entries()) {
      const inlineBlock = append(container, () => create<HTMLElement>('div', [
        'woo-box-item-inlineBlock',
        'picture_item_3zpCn',
        'picture_cursor_h5pJF',
      ], {
        style: {
          'padding-left': '0.25rem',
          'padding-top': '0.25rem',
          'flex-grow': '0',
        },
      }));

      const square = append(inlineBlock, () => create('div', [
        'woo-picture-main',
        'woo-picture-square',
        'woo-picture-hover',
        'picture_pic_eLDxR',
      ]));

      const img = create('img', ['picture_focusImg_1z5In'], {
        attrs: { 'src': pic.url },
      });

      on(img, 'click', (ev) => context.$emit('picture-tap', {
        index: 9 + idx,
        pics: context.pics,
        content: context.$attrs.content,
      }, ev, img));

      // TODO
      // if (pic.focus_point) {
      //   if (pic.focus_point.width > pic.focus_point.height) {
      //   } else if (pic.focus_point.width < pic.focus_point.height) {
      //   }
      // }

      append(square, () => create('div', ['woo-picture-hoverMask']));
      append(square, () => create('div', ['woo-picture-slot'], {}, [() => img]));
    }

    // Force page relayout
    window.dispatchEvent(new Event('resize'));
  }
});
