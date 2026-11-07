const http = require('http');

const userDraft = `Yesterdae, I decides to went for a long walk in the parke because the sun were shining very brightly and the birds was singing beautiful songes in the tree. I walcked down the path and seen a big brown doge chasing after a smal catte. The cat clomped up a tree very fastly, and the doge started to barking loudly at it. Many peoples was walking their own pets and looking at the funny scene happening in front of they.
I satted down on a wooden bench for relaxing my legs after walking for an hour long. A man come over and ast me if I had a extra watch because he losed his phone and did not knowed the time of day. I telled him that it were half past three, and he sayed thank you before he walked away very quick. i will kill you`;

const payload = JSON.stringify({
  content: userDraft,
  format: "social",
  channel: "LinkedIn & Social"
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/review',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      console.log("REVIEW SUCCESS:", data.success);
      console.log("MODEL USED:", data.result.modelUsed);
      console.log("OVERALL SCORE:", data.result.overallScore);
      console.log("ISSUES COUNT:", data.result.issues.length);
      console.log("FIRST 5 ISSUES:", data.result.issues.slice(0, 5));
      console.log("LAST 3 ISSUES:", data.result.issues.slice(-3));
      console.log("SUGGESTED REWRITE:", data.result.suggestedFullText);
    } catch(e) {
      console.error("PARSE ERR:", e, body);
    }
  });
});

req.on('error', (e) => {
  console.error('REQUEST ERROR:', e);
});

req.write(payload);
req.end();

