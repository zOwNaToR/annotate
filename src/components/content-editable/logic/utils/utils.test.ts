import { splitText } from '@/components/content-editable/logic/utils/utils';

describe('splitText', () => {
  it('should not split when position is same as text length', () => {
    const text = 'Hi, how are you?';
    const position = text.length;

    const [before, after] = splitText(text, position);

    expect(before).toEqual(text);
    expect(after).toEqual('');
  });

  it('should split the entire word when position is 0', () => {
    const text = 'Hi, how are you?';
    const position = 0;

    const [before, after] = splitText(text, position);

    expect(before).toEqual('');
    expect(after).toEqual(text);
  });

  it('should split correctly when position is 3', () => {
    const text = 'Hi, how are you?';
    const position = 3;

    const [before, after] = splitText(text, position);

    expect(before.length).toEqual(3);
    expect(after.length).toEqual(text.length - 3);
    expect(before).toEqual('Hi,');
    expect(after).toEqual(' how are you?');
  });
});
