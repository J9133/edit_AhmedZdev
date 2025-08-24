export async function upload(url, token, file) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      const base64 = reader.result.split(",")[1];
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Authorization": `token ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ message: `add ${file.name}`, content: base64, branch: "main" })
      });
      if (!response.ok) reject(await response.json());
      else resolve(await response.json());
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function updateJSON(url, token, datajson) {
  const response = await fetch(url, { headers: { 'Authorization': `token ${token}` } });
  const data = await response.json();
  const sha = data.sha;
  const currentContent = JSON.parse(atob(data.content.replace(/\n/g, '')));
  const updatedContent = { ...currentContent, ...datajson };
  const newContentEncoded = btoa(JSON.stringify(updatedContent));
  const updateResponse = await fetch(url, {
    method: 'PUT',
    headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'update', content: newContentEncoded, branch: 'main', sha: sha })
  });
  return updateResponse.ok ? updateResponse.json() : Promise.reject(await updateResponse.json());
}

export async function get(url, token) {
  const response = await fetch(url, { headers: { 'Authorization': `token ${token}` } });
  if (!response.ok) return null;
  return response.json();
}

export async function getHTML(url, token) {
  const response = await fetch(url, { headers: { 'Authorization': `token ${token}` } });
  const data = await response.json();
  const htmlText = atob(data.content.replace(/\n/g, ''));
  return { doc: new DOMParser().parseFromString(htmlText, "text/html"), sha: data.sha };
}

async function get_num(i) {
  const videos_json_c = await get(json_url, token);
  if (!videos_json_c) return 0;
  const j_v = JSON.parse(atob(videos_json_c.content));
  return i === 1 ? j_v.num : j_v.num2;
}

const json_url = "https://api.github.com/repos/J9133/AhmedZDev/contents/imgs/videos.json";
const url_url = "https://api.github.com/repos/J9133/AhmedZDev/contents/data/url/url.json";
const url2_url = "https://api.github.com/repos/J9133/AhmedZDev/contents/data/url/url2.json";
const Hurl = "https://api.github.com/repos/J9133/AhmedZDev/contents/index.html";
const token = "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";

async function addV() {
  const videoImgInput = document.getElementById("video_img");
  const videoUrlInput = document.getElementById("video_url");
  const videoFile = videoImgInput.files[0];
  const videoUrl = videoUrlInput.value;
  if (!videoFile || !videoUrl) return;
  let videoNum = await get_num(1);
  const newVideoNum = videoNum ? videoNum + 1 : 1;
  const new_video_name = `video${newVideoNum}.jpg`;
  let n_t_161731731738 = newVideoNum + 1
  const key = "url" + n_t_161731731738;
  await updateJSON(url_url, token, { [key]: videoUrl });
  const { doc: new_html, sha } = await getHTML(Hurl, token);
  const new_img = new_html.createElement("img");
  new_img.className = "videos";
  new_img.id = `video${newVideoNum}`;
  new_img.src = `/imgs/${new_video_name}`;
  new_img.alt = `video${newVideoNum}`;
  const container = new_html.getElementById("all_videos");
  if (!container) return;
  container.appendChild(new_img);
  const htmlString = new_html.documentElement.outerHTML;
  const contentEncoded = btoa(htmlString);
  await fetch(Hurl, {
    method: 'PUT',
    headers: { "Authorization": `token ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ message: `add video${newVideoNum}`, content: contentEncoded, branch: 'main', sha: sha })
  });
  const Vurl = `https://api.github.com/repos/J9133/AhmedZDev/contents/imgs/${new_video_name}`;
  await upload(Vurl, token, videoFile);
  await updateJSON(json_url, token, { num: newVideoNum });
}

async function addP() {
  const projectImgInput = document.getElementById("project_img");
  const projectURLInput = document.getElementById("project_url");
  const projectFile = projectImgInput.files[0];
  const project_url = projectURLInput.value;
  if (!projectFile || !project_url) return;
  let projectNum = await get_num(2);
  const newProjectNum = projectNum ? projectNum + 1 : 1;
  const new_project_name = `project${newProjectNum}.jpg`;
  const key = "url" + newProjectNum;
  await updateJSON(url2_url, token, { [key]: project_url });
  const { doc: new_html, sha } = await getHTML(Hurl, token);
  const new_img = new_html.createElement("img");
  new_img.className = "projects";
  new_img.id = `project${newProjectNum}`;
  new_img.src = `/imgs/projects/${new_project_name}`;
  new_img.alt = `project${newProjectNum}`;
  const container = new_html.getElementById("all_project");
  if (!container) return;
  container.appendChild(new_img);
  const htmlString = new_html.documentElement.outerHTML;
  const contentEncoded = btoa(htmlString);
  await fetch(Hurl, {
    method: 'PUT',
    headers: { "Authorization": `token ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ message: `add project${newProjectNum}`, content: contentEncoded, branch: 'main', sha: sha })
  });
  const Purl = `https://api.github.com/repos/J9133/AhmedZDev/contents/imgs/projects/${new_project_name}`;
  await upload(Purl, token, projectFile);
  await updateJSON(json_url, token, { num2: newProjectNum });
}

document.getElementById("add_video_button").addEventListener("click", () => addV());
document.getElementById("add_project_button").addEventListener("click", () => addP());
