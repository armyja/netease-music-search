require('dotenv').config();
const { song_detail, playlist_detail } = require('NeteaseCloudMusicApi');
const {
    USER_TOKEN: userToken,
    PLATLIST_ID: playListId
} = process.env;
const cookie = `MUSIC_U=${userToken}`;
const fs = require('fs').promises;
const path = require('path');

(async () => {
    const list_detail = await playlist_detail({
        cookie: cookie,
        id: playListId,
    }).catch(error => console.error(`无法获取用户记录 \n${error}`));
    
    const ids = list_detail.body.playlist.trackIds.map(track => track.id);
    const batchSize = 1000;
    
    let allSongDetails = [];

    for (let i = 0; i < ids.length; i += batchSize) {
        const batchIds = ids.slice(i, i + batchSize);
        try {
            const songs = await song_detail({
                cookie: cookie,
                ids: batchIds.join(',')
            });
            
            const songDetails = songs.body.songs.map(song => ({
                id: song.id,
                name: song.name,
                albumId: song.al.id,
                albumName: song.al.name,
                albumImageUrl: song.al.picUrl,
                artists: song.ar.map(artist => ({
                    id: artist.id,
                    name: artist.name
                }))
            }));
            
            allSongDetails = allSongDetails.concat(songDetails);
            
            console.log(`成功处理第 ${Math.floor(i/batchSize) + 1} 批歌曲`);
        } catch (error) {
            console.error(`处理第 ${Math.floor(i/batchSize) + 1} 批歌曲时出错:`, error);
        }
    }

    // 将所有数据写入 data/data.json 文件
    try {
        await fs.mkdir(path.dirname('./data/data.json'), { recursive: true });
        await fs.writeFile('./data/data.json', JSON.stringify(allSongDetails, null, 2));
        console.log('数据已成功写入 data/data.json 文件');
    } catch (error) {
        console.error('写入文件时出错:', error);
    }
})();