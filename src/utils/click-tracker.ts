export async function trackClick(event) {
    const el = event.currentTarget;
    if (!el) return;
    
    const payLoad = {
        clickTimestamp: new Date().toISOString(),
        relativeTimestamp: event.timeStamp,
        tag: el.tagName,
        elementId: el.id || null,
        toUrl: el.href || null,
        fromUrl: window.location.href,
        userAgent: navigator.userAgent,
        language: navigator.language,
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight
        },
        doNotTrack: navigator.doNotTrack === '1'
    };
    
    console.log('Click track payload: ', payLoad);

    try {
        const res = await fetch('/api/click-track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payLoad),
        });
  
        if (res.ok) {
          console.log('Click track payload sent successfully!');
        } else {
          throw new Error('Failed to send click track payload: '+res.statusText);
        }
    } catch (error) {
        console.error(error);
        console.error('Error sending click track payload.');
    }
}
