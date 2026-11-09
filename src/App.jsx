import React, { useState, useEffect } from 'react';
import { 
  Utensils, Clock, MapPin, Bell, BellOff, PlusCircle, 
  CheckCircle2, Flame, AlertCircle, Sparkles, X, Share2 
} from 'lucide-react';
import confetti from 'canvas-confetti';

const INITIAL_DROPS = [
  {
    id: 1,
    title: 'Executive Lunch Buffet Wraps & Fruit Skewers',
    event: 'ECE Department Seminar',
    location: 'Academic Block 2 - Room 301',
    portions: 'Approx. 15-20 portions',
    expiresInSeconds: 1560, // 26 mins
    dietTags: ['Vegetarian', 'Vegan-Friendly', 'Nut-Free'],
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80',
    host: 'Dr. Sharma (ECE Dept)',
    claimed: false
  },
  {
    id: 2,
    title: 'Artisan Pastries & Samosa Snack Boxes',
    event: 'Saturnalia Fest Planning Committee',
    location: 'Student Activity Centre - Hall B',
    portions: 'Approx. 25-30 snack boxes',
    expiresInSeconds: 2280, // 38 mins
    dietTags: ['Vegetarian', 'Contains Dairy'],
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80',
    host: 'Core Committee SAC',
    claimed: false
  },
  {
    id: 3,
    title: 'Gourmet Club Sandwiches & Cold Beverages',
    event: 'Alumni Mentorship Roundtable',
    location: 'Central Auditorium Boardroom',
    portions: 'Approx. 8-10 sandwiches',
    expiresInSeconds: 480, // 8 mins
    dietTags: ['Assorted Veg / Non-Veg'],
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80',
    host: 'Alumni Affairs Cell',
    claimed: false
  }
];

export default function App() {
  const [drops, setDrops] = useState(INITIAL_DROPS);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showHostModal, setShowHostModal] = useState(false);
  
  // Host Form State
  const [newTitle, setNewTitle] = useState('');
  const [newEvent, setNewEvent] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newPortions, setNewPortions] = useState('');
  const [newMinutes, setNewMinutes] = useState(30);
  const [newDiet, setNewDiet] = useState('Vegetarian');

  // Decrement countdown timers each second
  useEffect(() => {
    const timer = setInterval(() => {
      setDrops(prev => prev.map(drop => ({
        ...drop,
        expiresInSeconds: Math.max(0, drop.expiresInSeconds - 1)
      })));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (seconds) => {
    if (seconds <= 0) return 'Expired / Cleared';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s remaining`;
  };

  const toggleNotifications = () => {
    if (!notificationsEnabled) {
      if ('Notification' in window) {
        Notification.requestPermission().then(perm => {
          if (perm === 'granted') {
            setNotificationsEnabled(true);
            new Notification('BiteShare Alerts Active', {
              body: 'You will receive instant pings when excess catering is dropped on campus!'
            });
          } else {
            setNotificationsEnabled(true); // fallback mock
          }
        });
      } else {
        setNotificationsEnabled(true);
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  const handleCreateDrop = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLocation.trim()) return;

    const newDropItem = {
      id: Date.now(),
      title: newTitle,
      event: newEvent || 'Campus Department Mixer',
      location: newLocation,
      portions: newPortions || 'Approx. 10+ portions',
      expiresInSeconds: parseInt(newMinutes) * 60,
      dietTags: [newDiet],
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=700&q=80',
      host: 'You (Host)',
      claimed: false
    };

    setDrops([newDropItem, ...drops]);
    setShowHostModal(false);
    setNewTitle('');
    setNewEvent('');
    setNewLocation('');
    setNewPortions('');

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleClaim = (id) => {
    setDrops(prev => prev.map(d => d.id === id ? { ...d, claimed: true } : d));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#090d16', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Navigation Header */}
      <header style={{ background: '#0f172a', borderBottom: '1px solid #1e293b', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '38px', height: '38px', background: '#10b981', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Utensils size={20} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0, letterSpacing: '0.02em' }}>BiteShare</h1>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Campus Food Waste Flash Alert Board</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={toggleNotifications}
            style={{
              background: notificationsEnabled ? '#064e3b' : '#1e293b',
              border: notificationsEnabled ? '1px solid #10b981' : '1px solid #334155',
              borderRadius: '8px',
              padding: '8px 12px',
              color: notificationsEnabled ? '#6ee7b7' : '#94a3b8',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {notificationsEnabled ? <Bell size={14} /> : <BellOff size={14} />}
            {notificationsEnabled ? 'Alerts On' : 'Enable Alerts'}
          </button>

          <button
            onClick={() => setShowHostModal(true)}
            style={{
              background: '#10b981',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 14px',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <PlusCircle size={15} /> Host: Drop Food (60s)
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px' }}>
        {/* Banner */}
        <section style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #0f172a 100%)',
          borderRadius: '16px',
          border: '1px solid #059669',
          padding: '20px 24px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '11px', color: '#6ee7b7', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              CAMPUS ZERO-WASTE RADAR
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '4px 0 6px 0' }}>Fresh untouched meals ready for collection</h2>
            <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0 }}>
              Help eliminate food waste from department seminars & club events. Bring your own reusable container!
            </p>
          </div>
          <div style={{ textAlign: 'center', background: 'rgba(15, 23, 42, 0.6)', padding: '12px 18px', borderRadius: '12px', border: '1px solid #059669' }}>
            <span style={{ fontSize: '24px', fontWeight: '800', color: '#10b981' }}>{drops.filter(d => !d.claimed && d.expiresInSeconds > 0).length}</span>
            <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8' }}>Active Drops Now</span>
          </div>
        </section>

        {/* Drops Grid */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {drops.map(drop => {
            const isExpired = drop.expiresInSeconds <= 0;
            return (
              <div 
                key={drop.id}
                style={{
                  background: '#0f172a',
                  border: isExpired ? '1px solid #334155' : drop.claimed ? '1px solid #10b981' : '1px solid #1e293b',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  opacity: isExpired ? 0.6 : 1
                }}
              >
                {/* Photo & Badge */}
                <div style={{ position: 'relative', height: '170px' }}>
                  <img src={drop.image} alt={drop.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: isExpired ? '#475569' : drop.expiresInSeconds < 600 ? '#dc2626' : '#059669',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Clock size={12} />
                    {formatCountdown(drop.expiresInSeconds)}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '700' }}>{drop.event}</span>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '4px 0 8px 0', color: '#f8fafc' }}>{drop.title}</h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>
                      <MapPin size={14} color="#60a5fa" />
                      <strong>{drop.location}</strong>
                    </div>

                    <div style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '12px' }}>
                      Quantity: <strong>{drop.portions}</strong>
                    </div>

                    {/* Dietary Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                      {drop.dietTags.map(tag => (
                        <span key={tag} style={{ fontSize: '10px', background: '#1e293b', color: '#cbd5e1', padding: '3px 8px', borderRadius: '4px', border: '1px solid #334155' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action */}
                  <div style={{ borderTop: '1px solid #1e293b', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Host: {drop.host}</span>
                    {drop.claimed ? (
                      <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={14} /> You're On The Way!
                      </span>
                    ) : (
                      <button
                        disabled={isExpired}
                        onClick={() => handleClaim(drop.id)}
                        style={{
                          background: isExpired ? '#334155' : '#10b981',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 14px',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: isExpired ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {isExpired ? 'Cleared' : 'I am Coming!'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </main>

      {/* 60-Second Host Upload Modal */}
      {showHostModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }}>
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', width: '100%', maxWidth: '460px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0 }}>Flash Drop Excess Food</h3>
                <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Broadcast to students within 60 seconds</p>
              </div>
              <X size={18} style={{ cursor: 'pointer', color: '#94a3b8' }} onClick={() => setShowHostModal(false)} />
            </div>

            <form onSubmit={handleCreateDrop} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8' }}>Food Description / Items</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 15 Paneer Tikka Wraps, Fresh Salad"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8' }}>Event / Department</label>
                  <input
                    type="text"
                    placeholder="e.g. IEEE Workshop"
                    value={newEvent}
                    onChange={e => setNewEvent(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8' }}>Pickup Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lab 102, Block C"
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8' }}>Approximate Quantity</label>
                  <input
                    type="text"
                    placeholder="e.g. 12 boxes / serves 15"
                    value={newPortions}
                    onChange={e => setNewPortions(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8' }}>Clearance Countdown</label>
                  <select
                    value={newMinutes}
                    onChange={e => setNewMinutes(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
                  >
                    <option value={15}>15 Minutes</option>
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>60 Minutes</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8' }}>Dietary Category</label>
                <select
                  value={newDiet}
                  onChange={e => setNewDiet(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
                >
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Contains Nuts / Dairy">Contains Nuts / Dairy</option>
                </select>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '8px',
                  background: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Broadcast Drop Now 🚀
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}