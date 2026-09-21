import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { login, signup, AuthError, type User } from '@netlify/identity'
import { useIdentity } from '../lib/identity-context'
import { ArrowRight, Building2, CalendarDays, Check, ChevronRight, CircleDollarSign, LogOut, MapPin, Menu, Plus, Search, Sparkles, Users, X } from 'lucide-react'

export const Route = createFileRoute('/')({ component: App })

type Hall = { id: number; name: string; location: string; capacity: number; price: string; description: string; vendorId: string }
type Booking = { id: number; hallId: number; customerName: string; eventType: string; eventDate: string; guests: number; amount: string; status: string }
type Workspace = { role: 'customer' | 'vendor' | 'admin'; halls: Hall[]; bookings: Booking[] }

const previewHalls: Hall[] = [
  { id: 1, vendorId: 'preview', name: 'The Marigold Room', location: 'Jubilee Hills', capacity: 320, price: '145000', description: 'Sunset terrace, sculptural stage, and a dining room made for long celebrations.' },
  { id: 2, vendorId: 'preview', name: 'Paloma Courtyard', location: 'Banjara Hills', capacity: 180, price: '98000', description: 'An open-air courtyard with old-stone arches and a rain-ready glass canopy.' },
  { id: 3, vendorId: 'preview', name: 'House of Saffron', location: 'Financial District', capacity: 540, price: '225000', description: 'A dramatic column-free hall built for large weddings, launches, and galas.' },
]

function App() {
  const { user, ready, logout } = useIdentity()
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [addHallOpen, setAddHallOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const loadWorkspace = async () => { const response = await fetch('/api/workspace'); if (response.ok) setWorkspace(await response.json()) }
  useEffect(() => { if (user) loadWorkspace(); else setWorkspace(null) }, [user])

  if (ready && user) return <><Dashboard user={user} workspace={workspace} reload={loadWorkspace} onLogout={logout} onAddHall={() => setAddHallOpen(true)} notice={notice} setNotice={setNotice} />{addHallOpen && <HallModal onClose={() => setAddHallOpen(false)} onSaved={() => { setAddHallOpen(false); loadWorkspace() }} />}</>

  return (
    <main className="landing-shell">
      <div className="grain" />
      <nav className="topbar">
        <a href="#top" className="brand"><span>V</span> VOWSPACE</a>
        <div className={`navlinks ${mobileOpen ? 'open' : ''}`}>
          <a href="#spaces">Spaces</a><a href="#how">How it works</a><a href="#vendors">For vendors</a>
          <button className="text-button" onClick={() => { setAuthOpen(true); setMobileOpen(false) }}>Sign in</button>
          <button className="nav-cta" onClick={() => { setAuthOpen(true); setMobileOpen(false) }}>Plan an event <ArrowRight size={16} /></button>
        </div>
        <button className="menu-button" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu"><Menu /></button>
      </nav>
      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span /> THE ROOM CHANGES EVERYTHING</div>
          <h1>Find the space.<br /><em>Make it a story.</em></h1>
          <p>Remarkable function halls, honest pricing, and every booking detail in one place. For celebrations people keep talking about.</p>
          <div className="hero-actions">
            <button className="primary" onClick={() => document.querySelector('#spaces')?.scrollIntoView({ behavior: 'smooth' })}>Explore spaces <ArrowRight /></button>
            <button className="play-link" onClick={() => document.querySelector('#how')?.scrollIntoView({ behavior: 'smooth' })}><span>▶</span> See how it works</button>
          </div>
          <div className="trust-row"><b>4.9</b><span>★★★★★</span><small>from 1,248 celebrations</small></div>
        </div>
        <div className="hero-stage" aria-label="The Marigold Room featured venue">
          <div className="sun-disc" /><div className="arch arch-one" /><div className="arch arch-two" />
          <div className="venue-card"><div className="venue-number">01 / FEATURED</div><div><p>HYDERABAD · 320 GUESTS</p><h2>The<br />Marigold<br />Room</h2></div><div className="venue-bottom"><span>FROM ₹1.45L</span><button onClick={() => setAuthOpen(true)}><ArrowRight /></button></div></div>
          <div className="floating-note"><Sparkles size={18} /><b>12 dates open</b><span>this season</span></div>
        </div>
      </section>
      <section className="ticker"><span>WEDDINGS</span><i>✦</i><span>CORPORATE</span><i>✦</i><span>BIRTHDAYS</span><i>✦</i><span>RECEPTIONS</span><i>✦</i></section>
      <section className="spaces" id="spaces">
        <div className="section-head"><div><div className="eyebrow"><span /> CURATED FOR CHARACTER</div><h2>Spaces with<br /><em>something to say.</em></h2></div><p>Every venue is visited, verified, and chosen for the details that make a room feel alive.</p></div>
        <div className="hall-grid">{previewHalls.map((hall, index) => <article className={`hall-card hall-${index + 1}`} key={hall.name}>
          <div className="hall-visual"><span>{String(index + 1).padStart(2, '0')}</span><Building2 /></div>
          <div className="hall-info"><div><p><MapPin size={13} /> {hall.location}</p><h3>{hall.name}</h3></div><div className="price"><span>from</span><b>₹{Number(hall.price).toLocaleString('en-IN')}</b></div></div>
          <div className="hall-meta"><span><Users size={15} /> up to {hall.capacity}</span><button onClick={() => setAuthOpen(true)}>Check dates <ChevronRight size={15} /></button></div>
        </article>)}</div>
      </section>
      <section className="how" id="how"><div className="how-title"><div className="eyebrow light"><span /> ZERO CHAOS, ONE PLACE</div><h2>Your event,<br /><em>beautifully handled.</em></h2></div><div className="steps">
        {[[`01`,`DISCOVER`,`Search verified halls by date, capacity, neighborhood, and budget.`],[`02`,`BOOK`,`Send one clear request and speak directly with the venue team.`],[`03`,`CELEBRATE`,`Track approvals and details from a shared live dashboard.`]].map((s) => <div className="step" key={s[0]}><b>{s[0]}</b><Sparkles /><h3>{s[1]}</h3><p>{s[2]}</p></div>)}
      </div></section>
      <section className="vendor-band" id="vendors"><div><p>RUN A REMARKABLE VENUE?</p><h2>Less admin.<br />More full calendars.</h2></div><button onClick={() => setAuthOpen(true)}>List your hall <ArrowRight /></button></section>
      <footer><a className="brand" href="#top"><span>V</span> VOWSPACE</a><p>Extraordinary rooms for very good reasons.</p><span>© 2026 VowSpace</span></footer>
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </main>
  )
}

function AuthModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<'login'|'signup'>('login'); const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const [sent, setSent] = useState(false)
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setError(''); const data = new FormData(event.currentTarget)
    try {
      if (mode === 'login') await login(String(data.get('email')), String(data.get('password')))
      else { await signup(String(data.get('email')), String(data.get('password')), { full_name: String(data.get('name')), account_type: String(data.get('type')) }); setSent(true) }
    } catch (e) { setError(e instanceof AuthError && e.status === 401 ? 'That email and password do not match.' : e instanceof Error ? e.message : 'Something went wrong.') }
    finally { setBusy(false) }
  }
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="auth-modal" onMouseDown={(e) => e.stopPropagation()}><button className="modal-x" onClick={onClose}><X /></button><div className="auth-art"><div className="mini-arch" /><p>YOUR NEXT<br />GREAT EVENT<br /><em>STARTS HERE.</em></p></div><div className="auth-form">
    <div className="auth-tabs"><button className={mode==='login'?'active':''} onClick={() => setMode('login')}>Sign in</button><button className={mode==='signup'?'active':''} onClick={() => setMode('signup')}>Create account</button></div>
    {sent ? <div className="success-panel"><div><Check /></div><h2>Check your inbox</h2><p>We sent a confirmation link. Open it to activate your VowSpace account.</p></div> : <form onSubmit={submit}><p className="form-kicker">{mode === 'login' ? 'WELCOME BACK' : 'JOIN VOWSPACE'}</p><h2>{mode === 'login' ? 'Good to see you.' : 'Let’s get you inside.'}</h2>
      {mode === 'signup' && <><label>Full name<input name="name" required placeholder="Your name" /></label><label>I am joining as<select name="type"><option value="customer">Customer / event planner</option><option value="vendor">Venue vendor / manager</option></select></label></>}
      <label>Email address<input name="email" type="email" required placeholder="you@example.com" /></label><label>Password<input name="password" type="password" minLength={8} required placeholder="At least 8 characters" /></label>
      {error && <p className="form-error">{error}</p>}<button className="submit-button" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Enter VowSpace' : 'Create my account'} <ArrowRight /></button><small>By continuing, you agree to our terms and privacy policy.</small></form>}
  </div></div></div>
}

function Dashboard({ user, workspace, reload, onLogout, onAddHall, notice, setNotice }: { user: User; workspace: Workspace | null; reload: () => void; onLogout: () => Promise<void>; onAddHall: () => void; notice: string; setNotice: (s:string)=>void }) {
  const [view, setView] = useState('Overview'); const [bookHall, setBookHall] = useState<Hall|null>(null)
  const role = workspace?.role ?? (user.userMetadata?.account_type === 'vendor' ? 'vendor' : 'customer')
  const halls = workspace?.halls ?? []; const bookings = workspace?.bookings ?? []
  const revenue = useMemo(() => bookings.filter(b=>b.status !== 'cancelled').reduce((sum,b)=>sum+Number(b.amount),0), [bookings])
  const nav = role === 'customer' ? ['Overview','Explore halls','My bookings'] : role === 'vendor' ? ['Overview','My halls','Bookings','Calendar'] : ['Overview','All bookings','Venues','Customers','Reports']
  const updateStatus = async (bookingId:number,status:string) => { await fetch('/api/workspace',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'status',bookingId,status})}); setNotice(`Booking ${status}.`); reload() }
  return <main className="dashboard-shell"><aside className="sidebar"><a className="brand brand-light" href="/"><span>V</span> VOWSPACE</a><div className="role-chip">{role} portal</div><nav>{nav.map((item,index)=><button key={item} className={view===item?'active':''} onClick={()=>setView(item)}><span>{index===0?'◒':index===1?'◇':index===2?'□':'○'}</span>{item}</button>)}</nav><div className="sidebar-bottom"><div className="avatar">{(user.name || user.email || 'U')[0].toUpperCase()}</div><div><b>{user.name || 'VowSpace member'}</b><span>{user.email}</span></div><button onClick={onLogout} aria-label="Log out"><LogOut /></button></div></aside>
  <section className="dash-main"><header><div><p>{new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</p><h1>{view}</h1></div><div className="header-actions"><button className="icon-btn"><Search /></button>{role==='vendor'&&<button className="dash-primary" onClick={onAddHall}><Plus /> Add a hall</button>}</div></header>
  {notice && <div className="toast"><Check /> {notice}<button onClick={()=>setNotice('')}><X /></button></div>}
  {!workspace ? <div className="loading-grid"><div/><div/><div/></div> : <>
    <div className="welcome-strip"><div><span>{role === 'admin' ? 'PLATFORM PULSE' : role === 'vendor' ? 'VENUE OPERATIONS' : 'YOUR CELEBRATION DESK'}</span><h2>{role === 'admin' ? 'The whole room, at a glance.' : role === 'vendor' ? 'Keep the calendar moving.' : `Hello, ${(user.name || 'planner').split(' ')[0]}. Let’s make a date.`}</h2></div><Sparkles /></div>
    <div className="stat-grid"><Stat icon={<CalendarDays/>} label={role==='customer'?'My bookings':'Total bookings'} value={String(bookings.length)} note={`${bookings.filter(b=>b.status==='pending').length} awaiting action`} /><Stat icon={<CircleDollarSign/>} label={role==='customer'?'Planned spend':'Gross booking value'} value={`₹${revenue.toLocaleString('en-IN')}`} note="live shared records" /><Stat icon={<Building2/>} label={role==='vendor'?'My active halls':'Available halls'} value={String(role==='vendor'?halls.filter(h=>h.vendorId===user.id).length:halls.length)} note="ready to book" /><Stat icon={<Users/>} label="Guest volume" value={bookings.reduce((n,b)=>n+b.guests,0).toLocaleString()} note="across all events" /></div>
    <div className="dash-columns"><div className="panel"><div className="panel-head"><div><span>LIVE PIPELINE</span><h3>{role==='customer'?'Your bookings':'Recent bookings'}</h3></div></div>{bookings.length ? <div className="booking-list">{bookings.slice(0,6).map(b=><div className="booking-row" key={b.id}><div className="date-box"><b>{new Date(b.eventDate+'T00:00:00').getDate()||'—'}</b><span>{b.eventDate?new Date(b.eventDate+'T00:00:00').toLocaleString('en',{month:'short'}):'TBD'}</span></div><div className="booking-copy"><b>{b.eventType}</b><span>{halls.find(h=>h.id===b.hallId)?.name ?? 'Venue'} · {b.guests} guests</span></div><span className={`status ${b.status}`}>{b.status}</span>{role!=='customer'&&b.status==='pending'&&<button className="approve" onClick={()=>updateStatus(b.id,'confirmed')}>Approve</button>}</div>)}</div> : <Empty title="No bookings yet" text={role==='customer'?'Choose a hall and request your first date.':'New requests appear here the moment they arrive.'} />}</div>
    <div className="panel side-panel"><div className="panel-head"><div><span>{role==='customer'?'HANDPICKED':'CAPACITY'}</span><h3>{role==='customer'?'Spaces to explore':'Hall overview'}</h3></div></div>{halls.slice(0,3).map((h,i)=><div className="mini-hall" key={h.id}><div className={`mini-visual shade-${i}`}><Building2/></div><div><b>{h.name}</b><span>{h.location} · {h.capacity} guests</span></div>{role==='customer'&&<button onClick={()=>setBookHall(h)}><ChevronRight/></button>}</div>)}{role==='customer'&&<button className="wide-outline" onClick={()=>setView('Explore halls')}>See all spaces <ArrowRight/></button>}</div></div>
  </>}</section>{bookHall&&<BookingModal hall={bookHall} onClose={()=>setBookHall(null)} onSaved={()=>{setBookHall(null);setNotice('Booking request sent.');reload()}}/>}</main>
}

function Stat({icon,label,value,note}:{icon:ReactNode;label:string;value:string;note:string}) { return <div className="stat-card"><div className="stat-icon">{icon}</div><span>{label}</span><strong>{value}</strong><small>{note}</small></div> }
function Empty({title,text}:{title:string;text:string}) { return <div className="empty"><CalendarDays/><b>{title}</b><p>{text}</p></div> }

function BookingModal({ hall, onClose, onSaved }:{hall:Hall;onClose:()=>void;onSaved:()=>void}) {
  const [busy,setBusy]=useState(false); const [error,setError]=useState('')
  const submit=async(e:FormEvent<HTMLFormElement>)=>{e.preventDefault();setBusy(true);const d=new FormData(e.currentTarget);const r=await fetch('/api/workspace',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'book',hallId:hall.id,eventType:d.get('eventType'),eventDate:d.get('eventDate'),guests:Number(d.get('guests'))})});if(r.ok)onSaved();else{setError('Could not save this request. Please try again.');setBusy(false)}}
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="simple-modal" onMouseDown={e=>e.stopPropagation()}><button className="modal-x" onClick={onClose}><X/></button><p className="form-kicker">BOOKING REQUEST</p><h2>Save your date at<br/><em>{hall.name}</em></h2><p className="modal-lead">From ₹{Number(hall.price).toLocaleString('en-IN')} · up to {hall.capacity} guests</p><form onSubmit={submit}><label>Event type<select name="eventType"><option>Wedding</option><option>Reception</option><option>Corporate event</option><option>Birthday</option><option>Other celebration</option></select></label><div className="form-row"><label>Event date<input name="eventDate" type="date" required/></label><label>Guests<input name="guests" type="number" min="10" max={hall.capacity} required placeholder="120"/></label></div>{error&&<p className="form-error">{error}</p>}<button className="submit-button" disabled={busy}>{busy?'Sending…':'Send request'}<ArrowRight/></button></form></div></div>
}

function HallModal({onClose,onSaved}:{onClose:()=>void;onSaved:()=>void}) {
  const [busy,setBusy]=useState(false)
  const submit=async(e:FormEvent<HTMLFormElement>)=>{e.preventDefault();setBusy(true);const d=new FormData(e.currentTarget);const r=await fetch('/api/workspace',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'hall',name:d.get('name'),location:d.get('location'),capacity:d.get('capacity'),price:d.get('price'),description:d.get('description')})});if(r.ok)onSaved();else setBusy(false)}
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="simple-modal" onMouseDown={e=>e.stopPropagation()}><button className="modal-x" onClick={onClose}><X/></button><p className="form-kicker">VENUE INVENTORY</p><h2>Add a hall</h2><form onSubmit={submit}><label>Hall name<input name="name" required placeholder="e.g. The Orchid Pavilion"/></label><label>Location<input name="location" required placeholder="Neighborhood or city"/></label><div className="form-row"><label>Capacity<input name="capacity" type="number" min="10" required/></label><label>Starting price (₹)<input name="price" type="number" min="1" required/></label></div><label>Description<textarea name="description" rows={3} placeholder="What makes this room special?"/></label><button className="submit-button" disabled={busy}>{busy?'Adding…':'Publish hall'}<ArrowRight/></button></form></div></div>
}
