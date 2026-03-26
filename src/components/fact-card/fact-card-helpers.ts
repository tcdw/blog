export function createInitialPlaylist(length: number): number[] {
  return Array.from({ length }, (_, index) => index);
}

export function createPlaylist(length: number): number[] {
  const playlist = Array.from({ length }, (_, index) => index);

  for (let index = playlist.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [playlist[index], playlist[swapIndex]] = [playlist[swapIndex], playlist[index]];
  }

  return playlist;
}
