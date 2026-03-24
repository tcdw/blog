import hobbyMusic from "@/assets/hobbies/hobby_music.jpg";

export interface Fact {
  image: ImageMetadata;
  alt: string;
  text: string;
}

export const FACTS: Fact[] = [
  {
    image: hobbyMusic,
    alt: "音乐制作",
    text: "tcdw 偶尔会把游戏 OST 拿来做 16-bit 风格的 Arrangement，已经做了挺多首了。",
  },
  {
    image: hobbyMusic,
    alt: "音乐欣赏",
    text: "tcdw 的歌单里有大量的游戏原声，坐地铁的时候经常在单曲循环。",
  },
  {
    image: hobbyMusic,
    alt: "城市观察",
    text: "tcdw 喜欢在城市里散步，观察建筑和基础设施，觉得立交桥很美。",
  },
  {
    image: hobbyMusic,
    alt: "深夜编程",
    text: "tcdw 写代码的黄金时间是深夜，安静的时候效率最高。",
  },
  {
    image: hobbyMusic,
    alt: "摄影",
    text: "tcdw 会随手拍下觉得好看的城市角落，手机相册里全是天桥和烟囱。",
  },
];
