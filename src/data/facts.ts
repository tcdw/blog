import hobbyMusic from "@/assets/hobbies/hobby_music.jpg";
import hobbyCity from "@/assets/hobbies/hobby_city.jpg";

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
    image: hobbyCity,
    alt: "摄影",
    text: "tcdw 会随手拍下奇怪的城市角落。",
  },
];
