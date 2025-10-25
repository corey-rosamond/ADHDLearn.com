# Phase 19: Real-Time Updates

**Project:** ADHDLearn.com
**Phase:** 19 of 36
**Last Updated:** October 22, 2025

---

 Real-Time Updates

**Delivers:** See Aurora playing in real-time
**Aurora gets:** Nothing new
**You get:** 🔴 **Live updates - See when Aurora starts/finishes games**
**Deployed:** Parent dashboard shows real-time activity

---

### What This Phase Delivers

WebSocket integration for live updates:
- Parent sees "Aurora is playing Letter Pop now" banner
- Score updates appear live
- Notification when game ends
- "Currently playing" indicator on dashboard
- No page refresh needed

---

### Database Changes

**No new tables** - Uses existing tables.

---

### Backend Changes

**New dependency:** Socket.IO
```bash
npm install socket.io
```

**backend/src/server.js:**
```javascript
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://child.adhdlearn.com', 'http://parent.adhdlearn.com'],
    credentials: true
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('child-game-start', (data) => {
    // Broadcast to parent portal
    socket.to(`family-${data.familyId}`).emit('child-activity', {
      type: 'game-start',
      childName: data.childName,
      gameName: data.gameName,
      timestamp: new Date()
    });
  });
  
  socket.on('child-game-end', (data) => {
    socket.to(`family-${data.familyId}`).emit('child-activity', {
      type: 'game-end',
      childName: data.childName,
      gameName: data.gameName,
      score: data.score,
      timestamp: new Date()
    });
  });
  
  socket.on('join-family', (familyId) => {
    socket.join(`family-${familyId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

---

### Frontend Changes

**New dependency (both portals):** Socket.IO Client
```bash
npm install socket.io-client
```

**child-portal/src/services/socket.js:**
```javascript
import io from 'socket.io-client';

const socket = io('http://api.adhdlearn.com');

export function joinFamily(familyId) {
  socket.emit('join-family', familyId);
}

export function notifyGameStart(familyId, childName, gameName) {
  socket.emit('child-game-start', {
    familyId,
    childName,
    gameName
  });
}

export function notifyGameEnd(familyId, childName, gameName, score) {
  socket.emit('child-game-end', {
    familyId,
    childName,
    gameName,
    score
  });
}

export default socket;
```

**parent-portal/src/components/LiveActivityBanner.jsx:**
```javascript
import React, { useState, useEffect } from 'react';
import socket from '../services/socket';
import './LiveActivityBanner.css';

export default function LiveActivityBanner({ familyId }) {
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    socket.emit('join-family', familyId);
    
    socket.on('child-activity', (data) => {
      setActivity(data);
      
      // Auto-hide after 5 seconds
      setTimeout(() => setActivity(null), 5000);
    });
    
    return () => {
      socket.off('child-activity');
    };
  }, [familyId]);

  if (!activity) return null;

  return (
    <div className={`live-banner ${activity.type}`}>
      {activity.type === 'game-start' && (
        <p>🔴 {activity.childName} is playing {activity.gameName} right now!</p>
      )}
      {activity.type === 'game-end' && (
        <p>✅ {activity.childName} finished {activity.gameName}! Score: {activity.score}</p>
      )}
    </div>
  );
}

// McCabe complexity: 2 (within limit)
```

---

### Acceptance Criteria

- [ ] Socket.IO server running
- [ ] WebSocket connection established from both portals
- [ ] Child portal emits game-start event
- [ ] Child portal emits game-end event
- [ ] Parent portal receives real-time updates
- [ ] Live banner displays on parent dashboard
- [ ] Banner shows child name and game name
- [ ] Banner auto-hides after 5 seconds
- [ ] Multiple children supported (family rooms)
- [ ] Connection resilient to network issues

---

### Dependencies

- Phase 4: Parent Registration + Login
- Phase 7: Child Login
- Phase 3: Backend infrastructure (server must support WebSocket)


---

