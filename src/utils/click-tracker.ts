export async function trackClick(event) {
    const userIdKey = 'SMYLSYNC_USER';
    const el = event.currentTarget;
    if (!el) return;
    let userId = localStorage.getItem(userIdKey);
    if (!userId) {
        userId = Math.random().toString(36) + Date.now().toString(36);
        localStorage.setItem(userIdKey, userId);
    }
    
    const payLoad = {
        userId: userId || null,
        clickTimestamp: new Date().toISOString(),
        relativeTimestamp: event.timeStamp.toString(),
        tag: el.tagName,
        elementId: el.id || null,
        toUrl: el.href || ' ', // href is null for non-anchor elements, so set to a space to avoid empty string
        fromUrl: window.location.href,
        userAgent: navigator.userAgent,
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight
        },
        doNotTrack: navigator.doNotTrack === '1'
    };
    
    //console.log('Click track payload: ', payLoad);

    try {
        const res = await fetch('/api/click-track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payLoad),
        });
  
        if (res.ok) {
          //console.log('Click track payload sent successfully!');
        } else {
          throw new Error('Failed to send click track payload: '+res.statusText);
        }
    } catch (error) {
        console.error(error);
        console.error('Error sending click track payload.');
    }

    event.debounced = true; // mark the event as handled
}
