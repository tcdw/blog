import hobbyMusic from "@/assets/hobbies/hobby_music.jpg";
import hobbyCity from "@/assets/hobbies/hobby_city.jpg";
import hobbyCafeSearch from "@/assets/hobbies/hobby_cafe_search.jpg";
import hobbyAbstract from "@/assets/hobbies/hobby_abstract.jpg";
import hobbyGoods from "@/assets/hobbies/hobby_goods.jpg";
import favoriteNayukiTea from "@/assets/hobbies/favorite_nayuki_tea.jpg";

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
  {
    image: hobbyCafeSearch,
    alt: "咖啡店探店",
    text: "tcdw 喜欢在去不同的咖啡店坐坐，工作日的晚上也是。",
  },
  {
    image: hobbyAbstract,
    alt: "抽象艺术",
    text: "tcdw 喜欢搞抽象，即使它们毫无实际价值。",
  },
  {
    image: hobbyGoods,
    alt: "收藏品",
    text: "tcdw 喜欢收集各种谷子（小物件），尤其是《蔚蓝档案》的同人谷。",
  },
  {
    image: favoriteNayukiTea,
    alt: "奈雪的茶",
    text: "tcdw 喜欢喝奈雪的茶。",
  },
];
