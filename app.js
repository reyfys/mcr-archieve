const allAlbums=[...MCR_DATA.albums,MCR_DATA.special];
const $=s=>document.querySelector(s);
const lyricsKey='mcr-archive-lyrics-v1',savedKey='mcr-archive-saved-v1';
let lyrics=JSON.parse(localStorage.getItem(lyricsKey)||'{}'),saved=new Set(JSON.parse(localStorage.getItem(savedKey)||'[]'));
let active=null,showSaved=false,installPrompt=null;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function key(album,track){return album.id+'::'+track}
function allTracks(){return allAlbums.flatMap(a=>a.tracks.map((t,i)=>({album:a,track:t,index:i+1})))}
function render(){
 const q=$('#searchInput').value.trim().toLowerCase(),grid=$('#albumGrid');let count=0;
 const matching=allAlbums.map(a=>({...a,filtered:a.tracks.map((t,i)=>({t,i})).filter(x=>(!q||x.t.toLowerCase().includes(q)||a.title.toLowerCase().includes(q))&&(!showSaved||saved.has(key(a,x.t))))})).filter(a=>a.filtered.length);
 grid.innerHTML=matching.map(a=>{count+=a.filtered.length;return `<button class="album-card" data-album="${a.id}"><img class="album-cover" src="${a.art}" alt=""><div class="album-info"><div class="album-year">${esc(a.year)} · ${esc(a.kind.toUpperCase())}</div><div class="album-title">${esc(a.title)}</div><div class="album-foot"><span>${a.filtered.length} TRACKS SHOWN</span><b>OPEN ↗</b></div></div></button>`}).join('')||'<p class="tiny-note">No songs found. Try another search.</p>';
 $('#trackCount').textContent=count+' TRACKS';$('#savedCount').textContent=saved.size;
 grid.querySelectorAll('[data-album]').forEach(b=>b.addEventListener('click',()=>openAlbum(allAlbums.find(a=>a.id===b.dataset.album),q)));
}
function openAlbum(album,q=''){
 const filtered=album.tracks.map((t,i)=>({t,i})).filter(x=>!q||x.t.toLowerCase().includes(q)||album.title.toLowerCase().includes(q));
 const drawer=$('#drawer');$('#drawerAlbum').textContent=album.title.toUpperCase();$('#drawerTitle').textContent=album.title;$('#drawerSub').textContent=album.year+' · '+album.kind;
 $('#trackIndex').textContent='TRACKLIST · '+filtered.length+' SONGS';
 $('#lyricsInput').value='';$('#lyricState').textContent='SELECT A TRACK';
 const list=filtered.map(({t,i})=>`<button class="track-row" data-track="${i}" style="display:flex;width:100%;text-align:left;align-items:center;gap:13px;padding:13px 0;border:0;border-bottom:1px solid #302c30;background:none;color:#eee9e4;cursor:pointer"><span style="font:10px var(--mono);color:#ef302b;width:24px">${String(i+1).padStart(2,'0')}</span><span style="flex:1;font:600 15px var(--body)">${esc(t)}</span><span style="font:9px var(--mono);color:${lyrics[key(album,t)]?'#4cc77d':'#766e6c'}">${lyrics[key(album,t)]?'SAVED':'OPEN ↗'}</span></button>`).join('');
 const content=document.createElement('div');content.innerHTML=`<div class="tracklist">${list}</div>`;const scroll=$('.drawer-scroll');scroll.innerHTML=`<p class="track-index">ALBUM / TRACKLIST</p><h2>${esc(album.title)}</h2><p class="drawer-sub">${esc(album.year)} · ${esc(album.kind)}</p><div class="drawer-actions"><button class="outline-btn" id="closeAlbum">← BACK TO ARCHIVE</button></div></div>`;
 scroll.appendChild(content);$('#closeAlbum').onclick=closeDrawer;
 scroll.querySelectorAll('[data-track]').forEach(b=>b.addEventListener('click',()=>openTrack(album,Number(b.dataset.track))));
 drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');
}
function openTrack(album,index){
 const track=album.tracks[index],k=key(album,track);active={album,index,track};const scroll=$('.drawer-scroll');
 scroll.innerHTML=`<p class="track-index">TRACK ${String(index+1).padStart(2,'0')} / ${esc(album.title.toUpperCase())}</p><h2>${esc(track)}</h2><p class="drawer-sub">${esc(album.year)} · ${esc(album.kind)}</p><div class="drawer-actions"><button class="outline-btn" id="backTracks">← TRACKLIST</button><button class="outline-btn" id="bookmarkBtn">${saved.has(k)?'♥ SAVED':'♡ SAVE SONG'}</button><a class="outline-btn" target="_blank" rel="noopener" href="https://www.google.com/search?q=${encodeURIComponent('My Chemical Romance '+track+' lyrics official') }">FIND LYRICS ↗</a></div><div class="lyrics-area"><div class="lyrics-head"><span>YOUR LYRICS</span><span id="lyricState">${lyrics[k]?'SAVED OFFLINE':'NOT SAVED'}</span></div><textarea id="lyricsInput" placeholder="Paste lyrics you have permission to use here. Save them on this device to read offline..."></textarea><div class="lyrics-actions"><button class="solid-btn" id="saveLyrics">SAVE FOR OFFLINE</button><button class="text-btn" id="clearLyrics">CLEAR</button></div><p class="tiny-note">Text stays on this device in this browser. It is not uploaded. The archive does not include copyrighted lyrics.</p></div>`;
 $('#lyricsInput').value=lyrics[k]||'';
 $('#backTracks').onclick=()=>openAlbum(album);
 $('#bookmarkBtn').onclick=()=>{saved.has(k)?saved.delete(k):saved.add(k);localStorage.setItem(savedKey,JSON.stringify([...saved]));$('#bookmarkBtn').textContent=saved.has(k)?'♥ SAVED':'♡ SAVE SONG';$('#savedCount').textContent=saved.size;};
 $('#saveLyrics').onclick=()=>{const value=$('#lyricsInput').value.trim();if(value){lyrics[k]=value}else{delete lyrics[k]}localStorage.setItem(lyricsKey,JSON.stringify(lyrics));$('#lyricState').textContent=value?'SAVED OFFLINE':'NOT SAVED';};
 $('#clearLyrics').onclick=()=>{$('#lyricsInput').value='';};
}
function closeDrawer(){$('#drawer').classList.remove('open');$('#drawer').setAttribute('aria-hidden','true')}
$('#closeDrawer').onclick=closeDrawer;$('#closeX').onclick=closeDrawer;
$('#searchInput').addEventListener('input',render);
$('#savedFilter').onclick=()=>{showSaved=!showSaved;$('#savedFilter').classList.toggle('active',showSaved);render()};
$('#openSpecial').onclick=()=>openAlbum(MCR_DATA.special);
render();
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').then(()=>{$('#offlineStatus').innerHTML='<i></i> OFFLINE READY'}).catch(()=>{}));
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;$('#installBtn').hidden=false});
$('#installBtn').onclick=async()=>{if(installPrompt){installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$('#installBtn').hidden=true}};
