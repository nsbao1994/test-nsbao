let tokenClient;
const CLIENT_ID = '398509518475-7bjid324tkuuh9gv8b0g92lhsgv8nrl5.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/drive';
function initializeGoogleAuth() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (resp) => {
            if (resp.error !== undefined) {
                throw (resp);
            }
            // Handle successful auth
        }
    });
}

// Call this on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    initializeGoogleAuth();
    // ... rest of your initialization
});
function handleAuthClick() {
            tokenClient.callback = async (resp) => {
                if (resp.error !== undefined) {
                    throw (resp);
                }
                await showLoggedInState();
            };

            if (gapi.client.getToken() === null) {
                tokenClient.requestAccessToken({prompt: 'consent'});
            } else {
                tokenClient.requestAccessToken({prompt: ''});
            }
        }

        function handleSignoutClick() {
            const token = gapi.client.getToken();
            if (token !== null) {
                google.accounts.oauth2.revoke(token.access_token);
                gapi.client.setToken('');
                showLoggedOutState();
            }
        }

        async function showLoggedInState() {
            document.getElementById('loginSection').classList.add('hidden');
            document.getElementById('loggedInSection').classList.remove('hidden');
            document.getElementById('statusInfo').innerHTML = '<p>🟢 Đã kết nối Google Drive</p>';
            
            document.getElementById('scanBtn').disabled = false;
            document.getElementById('clearCacheBtn').disabled = false;
            document.getElementById('loadAnalysisBtn').disabled = false;
            
            try {
                const response = await gapi.client.request({
                    path: 'https://www.googleapis.com/oauth2/v1/userinfo',
                });
                document.getElementById('userInfo').textContent = `Xin chào, ${response.result.name}!`;
            } catch (error) {
                console.error('Error getting user info:', error);
            }
        }

        function showLoggedOutState() {
            document.getElementById('loginSection').classList.remove('hidden');
            document.getElementById('loggedInSection').classList.add('hidden');
            document.getElementById('statusInfo').innerHTML = '<p>🔴 Chưa kết nối Google Drive</p>';
            
            const buttons = ['scanBtn', 'clearCacheBtn', 'loadAnalysisBtn', 'analyzeBtn', 'saveAnalysisBtn', 'generateBtn', 'saveBtn'];
            buttons.forEach(id => document.getElementById(id).disabled = true);
        }
