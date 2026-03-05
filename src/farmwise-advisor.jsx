/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Camera, TrendingUp, Cloud, DollarSign, MapPin, AlertCircle,
         CheckCircle, ArrowRight, Upload, Loader, LogOut, User,
         History, Eye, Trash2, ChevronDown, Lock, Mail, Leaf } from 'lucide-react';

// ─── Supabase ─────────────────────────────────────────────────────────────────
// Replace with your actual values from Supabase Dashboard → Settings → API
const SUPABASE_URL  = 'https://tkcudgltjhosnhxantif.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrY3VkZ2x0amhvc25oeGFudGlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MjU5ODUsImV4cCI6MjA4ODIwMTk4NX0.XzmXq2CD535jJLBaO4MMazwuqr39j3gpWVXPKCIs-Bk';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

const API_BASE = 'https://maheshdhanve-317-farmwise-backend.hf.space/api';

// ─── Auth Page ────────────────────────────────────────────────────────────────
const AuthPage = ({ onAuth }) => {
  const [mode, setMode]         = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [farmSize, setFarmSize]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (mode === 'signup') {
        // eslint-disable-next-line no-unused-vars
        const { data: _signUpData, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } }
        });
        if (error) throw error;
        setSuccess('Account created! Check your email to confirm, then sign in.');
        setMode('signin');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onAuth(data.user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a4d2e 0%, #2d5a3d 40%, #0f3320 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: '"Quicksand", "Segoe UI", sans-serif',
      padding: '2rem', position: 'relative', overflow: 'hidden'
    }}>
      {/* Background circles */}
      {[
        { size: 400, top: '-100px', left: '-100px', opacity: 0.06 },
        { size: 300, bottom: '-80px', right: '-80px', opacity: 0.08 },
        { size: 200, top: '40%', right: '10%', opacity: 0.05 },
      ].map((c, i) => (
        <div key={i} style={{
          position: 'absolute', width: c.size, height: c.size,
          borderRadius: '50%', background: '#8bc34a',
          top: c.top, left: c.left, bottom: c.bottom, right: c.right,
          opacity: c.opacity, pointerEvents: 'none'
        }} />
      ))}

      <div style={{
        background: 'rgba(255,255,255,0.97)',
        borderRadius: '28px', padding: '3rem',
        width: '100%', maxWidth: '440px',
        boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
        position: 'relative', zIndex: 1
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '72px', height: '72px', margin: '0 auto 1rem',
            background: 'linear-gradient(135deg, #8bc34a, #558b2f)',
            borderRadius: '20px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '2.5rem',
            boxShadow: '0 8px 25px rgba(139,195,74,0.4)'
          }}>🌾</div>
          <h1 style={{ color: '#1a4d2e', margin: 0, fontSize: '1.9rem', fontWeight: 800 }}>
            FarmWise Advisor
          </h1>
          <p style={{ color: '#689f38', margin: '0.5rem 0 0', fontSize: '0.95rem', fontWeight: 600 }}>
            Smart Farming, Better Profits
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', background: '#f1f8e9', borderRadius: '14px', padding: '4px', marginBottom: '1.75rem' }}>
          {[['signin','Sign In'],['signup','Sign Up']].map(([val, label]) => (
            <button key={val} onClick={() => { setMode(val); setError(''); setSuccess(''); }} style={{
              flex: 1, padding: '0.75rem', border: 'none', borderRadius: '11px', fontWeight: 700,
              fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s',
              background: mode === val ? 'linear-gradient(135deg,#8bc34a,#689f38)' : 'transparent',
              color: mode === val ? '#fff' : '#689f38',
              boxShadow: mode === val ? '0 4px 12px rgba(139,195,74,0.35)' : 'none',
              fontFamily: 'inherit'
            }}>{label}</button>
          ))}
        </div>

        {/* Alerts */}
        {error   && <div style={{ background: '#ffebee', border: '1.5px solid #ef9a9a', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#c62828', fontSize: '0.9rem', fontWeight: 600 }}>⚠️ {error}</div>}
        {success && <div style={{ background: '#e8f5e9', border: '1.5px solid #a5d6a7', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#2e7d32', fontSize: '0.9rem', fontWeight: 600 }}>✅ {success}</div>}

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mode === 'signup' && (
            <>
              <div>
                <label style={{ display: 'block', color: '#1a4d2e', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.95rem' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="#8bc34a" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input value={fullName} onChange={e => setFullName(e.target.value)}
                    placeholder="Your full name"
                    style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', border: '2px solid #c8e6c9', borderRadius: '12px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border 0.2s' }}
                    onFocus={e => e.target.style.borderColor = '#8bc34a'}
                    onBlur={e  => e.target.style.borderColor = '#c8e6c9'}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', color: '#1a4d2e', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.95rem' }}>Farm Size (acres)</label>
                <div style={{ position: 'relative' }}>
                  <Leaf size={18} color="#8bc34a" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input value={farmSize} onChange={e => setFarmSize(e.target.value)}
                    type="number" min="0.5" step="0.5" placeholder="e.g. 5"
                    style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', border: '2px solid #c8e6c9', borderRadius: '12px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border 0.2s' }}
                    onFocus={e => e.target.style.borderColor = '#8bc34a'}
                    onBlur={e  => e.target.style.borderColor = '#c8e6c9'}
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label style={{ display: 'block', color: '#1a4d2e', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.95rem' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#8bc34a" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input value={email} onChange={e => setEmail(e.target.value)}
                type="email" placeholder="you@example.com"
                style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', border: '2px solid #c8e6c9', borderRadius: '12px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border 0.2s' }}
                onFocus={e => e.target.style.borderColor = '#8bc34a'}
                onBlur={e  => e.target.style.borderColor = '#c8e6c9'}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', color: '#1a4d2e', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.95rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#8bc34a" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input value={password} onChange={e => setPassword(e.target.value)}
                type="password" placeholder="••••••••"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', border: '2px solid #c8e6c9', borderRadius: '12px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border 0.2s' }}
                onFocus={e => e.target.style.borderColor = '#8bc34a'}
                onBlur={e  => e.target.style.borderColor = '#c8e6c9'}
              />
            </div>
          </div>

          <button onClick={handleSubmit} disabled={loading} style={{
            width: '100%', padding: '1rem', marginTop: '0.5rem',
            background: loading ? '#9e9e9e' : 'linear-gradient(135deg,#8bc34a,#558b2f)',
            border: 'none', borderRadius: '14px', color: '#fff',
            fontSize: '1.1rem', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
            boxShadow: loading ? 'none' : '0 6px 20px rgba(139,195,74,0.45)',
            transition: 'all 0.2s', fontFamily: 'inherit'
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {loading
              ? <><Loader size={20} style={{ animation: 'spin 1s linear infinite' }} /> Please wait...</>
              : mode === 'signin' ? '🌾 Sign In' : '🌱 Create Account'
            }
          </button>
        </div>

        <p style={{ textAlign: 'center', color: '#9e9e9e', fontSize: '0.85rem', marginTop: '1.5rem', marginBottom: 0 }}>
          Your farming data is private and secure 🔒
        </p>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700;800&display=swap'); @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

// ─── History Panel ────────────────────────────────────────────────────────────
const HistoryPanel = ({ userId, onRestore }) => {
  const [records, setRecords]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [expanded, setExpanded] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);
    if (!error) setRecords(data || []);
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchHistory(); }, [userId]);

  const deleteRecord = async (id) => {
    await supabase.from('analyses').delete().eq('id', id);
    setRecords(r => r.filter(x => x.id !== id));
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', gap: '1rem', color: '#689f38' }}>
      <Loader size={28} style={{ animation: 'spin 1s linear infinite' }} />
      <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Loading history...</span>
    </div>
  );

  if (!records.length) return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌱</div>
      <h3 style={{ color: '#1a4d2e', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>No analyses yet</h3>
      <p style={{ color: '#689f38' }}>Run your first soil analysis to see history here</p>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: '#1a4d2e', fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>📋 Analysis History</h2>
        <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '0.4rem 1rem', borderRadius: '20px', fontWeight: 700, fontSize: '0.9rem' }}>
          {records.length} records
        </span>
      </div>

      {records.map((rec, i) => (
        <div key={rec.id} style={{
          background: expanded === rec.id ? 'linear-gradient(135deg,#f1f8e9,#e8f5e9)' : '#fff',
          border: `2px solid ${expanded === rec.id ? '#8bc34a' : '#e8f5e9'}`,
          borderRadius: '16px', marginBottom: '1rem', overflow: 'hidden',
          transition: 'all 0.3s ease', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
        }}>
          {/* Header row */}
          <div style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
          onClick={() => setExpanded(expanded === rec.id ? null : rec.id)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg,#8bc34a,#558b2f)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                🌱
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#1a4d2e', fontSize: '1.1rem' }}>
                  {rec.soil_type || 'Unknown'} Soil — {rec.location}
                </div>
                <div style={{ color: '#8bc34a', fontSize: '0.85rem', fontWeight: 600, marginTop: '0.2rem' }}>
                  {new Date(rec.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Top crop badge */}
              {rec.top_crops?.[0] && (
                <div style={{ background: '#fff9c4', border: '1.5px solid #fbc02d', color: '#f57f17', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
                  ⭐ {rec.top_crops[0].name}
                </div>
              )}
              <button onClick={e => { e.stopPropagation(); onRestore(rec); }} style={{ background: '#e8f5e9', border: 'none', borderRadius: '8px', padding: '0.5rem', cursor: 'pointer', color: '#2e7d32' }} title="View analysis">
                <Eye size={16} />
              </button>
              <button onClick={e => { e.stopPropagation(); deleteRecord(rec.id); }} style={{ background: '#ffebee', border: 'none', borderRadius: '8px', padding: '0.5rem', cursor: 'pointer', color: '#c62828' }} title="Delete">
                <Trash2 size={16} />
              </button>
              <ChevronDown size={20} color="#8bc34a" style={{ transform: expanded === rec.id ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }} />
            </div>
          </div>

          {/* Expanded details */}
          {expanded === rec.id && (
            <div style={{ padding: '0 1.5rem 1.5rem', borderTop: '1.5px solid #c8e6c9' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '1rem', marginTop: '1rem' }}>
                {[
                  { label: 'pH',         value: rec.ph },
                  { label: 'Nitrogen',   value: rec.nitrogen },
                  { label: 'Phosphorus', value: rec.phosphorus },
                  { label: 'Potassium',  value: rec.potassium },
                  { label: 'Moisture',   value: rec.moisture },
                  { label: 'Confidence', value: rec.confidence ? `${rec.confidence}%` : '—' },
                ].map((item, i) => (
                  <div key={i} style={{ background: '#fff', padding: '0.875rem', borderRadius: '10px', border: '1.5px solid #e8f5e9' }}>
                    <div style={{ color: '#8bc34a', fontSize: '0.78rem', fontWeight: 700 }}>{item.label}</div>
                    <div style={{ color: '#1b5e20', fontWeight: 700, marginTop: '0.2rem' }}>{item.value || '—'}</div>
                  </div>
                ))}
              </div>

              {rec.top_crops?.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ color: '#1a4d2e', fontWeight: 700, marginBottom: '0.5rem' }}>🌾 Crop Recommendations:</div>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {rec.top_crops.map((c, i) => (
                      <div key={i} style={{ background: i === 0 ? 'linear-gradient(135deg,#fbc02d,#f57f17)' : '#e8f5e9', color: i === 0 ? '#fff' : '#2e7d32', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 700, fontSize: '0.9rem' }}>
                        {c.name} — {c.suitabilityScore}%
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
const FarmWiseAdvisor = () => {
  const [user, setUser]                   = useState(null);
  const [authLoading, setAuthLoading]     = useState(true);
  const [activeTab, setActiveTab]         = useState('soil-analysis');
  const [soilImage, setSoilImage]         = useState(null);
  const [soilImagePreview, setSoilImagePreview] = useState(null);
  const [location, setLocation]           = useState('');
  const [analyzing, setAnalyzing]         = useState(false);
  const [analysis, setAnalysis]           = useState(null);
  const [weatherData, setWeatherData]     = useState(null);
  const [marketData, setMarketData]       = useState(null);
  const [errorMsg, setErrorMsg]           = useState(null);
  const [saveStatus, setSaveStatus]       = useState(null); // 'saving' | 'saved' | 'error'

  // Check session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAnalysis(null);
    setWeatherData(null);
    setMarketData(null);
    setActiveTab('soil-analysis');
  };

  // Save analysis to Supabase
  const saveAnalysis = async (soilData, wxData, recData, mktData, loc, mappedCrops = null) => {
    if (!user) return;
    setSaveStatus('saving');
    try {
      const { error } = await supabase.from('analyses').insert({
        user_id:              user.id,
        location:             loc,
        soil_type:            soilData.soilType,
        confidence:           soilData.confidence,
        ph:                   soilData.ph,
        nitrogen:             soilData.nitrogen,
        phosphorus:           soilData.phosphorus,
        potassium:            soilData.potassium,
        organic_matter:       soilData.organicMatter,
        moisture:             soilData.moisture,
        drainage:             soilData.drainage,
        soil_recommendations: soilData.recommendations || [],
        weather_temp:         wxData.weather?.current?.temp,
        weather_humidity:     wxData.weather?.current?.humidity,
        weather_condition:    wxData.weather?.current?.label,
        weather_advisory:     wxData.weather?.advisory,
        top_crops:            mappedCrops || recData.recommendations?.topCrops || [],
        market_snapshot:      mktData.markets?.nearbyMarkets?.[0]?.crops?.slice(0, 6) || [],
      });
      setSaveStatus(error ? 'error' : 'saved');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch {
      setSaveStatus('error');
    }
  };

  const analyzeSoil = async () => {
    if (!soilImage) { alert('Please upload a soil image first'); return; }
    if (!location.trim()) { alert('Please enter your location'); return; }
    setAnalyzing(true);
    setErrorMsg(null);

    try {
      const cityName = location.split(',')[0].trim();

      const geoResp = await fetch(`${API_BASE}/geocode?location=${encodeURIComponent(cityName)}`);
      const geoData = await geoResp.json();
      if (!geoData.success) throw new Error('Location not found. Try just the city name e.g. "Pune"');

      const formData = new FormData();
      formData.append('image', soilImage);
      formData.append('location', location);
      const soilResp = await fetch(`${API_BASE}/analyze-soil`, { method: 'POST', body: formData });
      const soilData = await soilResp.json();
      if (!soilData.success) throw new Error(soilData.error || 'Soil analysis failed');

      const wxResp = await fetch(`${API_BASE}/weather?lat=${geoData.latitude}&lon=${geoData.longitude}&location=${encodeURIComponent(cityName)}`);
      const wxData = await wxResp.json();

      const mktResp = await fetch(`${API_BASE}/markets?location=${encodeURIComponent(cityName)}`);
      const mktData = await mktResp.json();

      const recResp = await fetch(`${API_BASE}/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ soilAnalysis: soilData.analysis, weatherData: wxData, marketData: mktData, location, farmSizeAcres: 5 }),
      });
      const recData = await recResp.json();
      if (!recData.success) throw new Error(recData.error || 'Recommendations failed');

      setAnalysis(soilData.analysis);
      setWeatherData({
        current:  { temp: wxData.weather.current.temp, condition: wxData.weather.current.label || 'Clear', humidity: wxData.weather.current.humidity },
        forecast: (wxData.weather.forecast || []).map(d => ({ day: d.day, temp: d.tempMax, rain: d.rainChance, condition: d.label || 'Clear' })),
        seasonal: wxData.weather.advisory,
      });
      setMarketData({
        nearbyMarkets: mktData.markets.nearbyMarkets,
        topCrops: recData.recommendations.topCrops.map(crop => ({
          name:            crop.name,
          suitability:     crop.suitabilityScore,
          avgPrice:        crop.avgPrice || crop.bestPricePerQuintal,
          bestMarket:      crop.bestMarket,
          bestPrice:       crop.bestPricePerQuintal || crop.avgPrice,
          estimatedProfit: crop.estimatedProfitPerAcre || 0,
          growthDuration:  crop.growthDuration || `${crop.growthDurationDays || '?'} days`,
          reasons:         [...(crop.soilFitReasons||[]), ...(crop.marketFitReasons||[]), ...(crop.weatherFitReasons||[])],
          requirements:    crop.requirements || '',
          riskFactors:     Array.isArray(crop.riskFactors) ? crop.riskFactors.join(', ') : (crop.riskFactors || ''),
        })),
      });

      // Build fully-mapped crops (same as what's shown in the UI)
      const mappedCrops = recData.recommendations.topCrops.map(crop => ({
        name:              crop.name,
        suitabilityScore:  crop.suitabilityScore,
        avgPrice:          crop.avgPrice || crop.bestPricePerQuintal,
        bestPrice:         crop.bestPricePerQuintal || crop.avgPrice,
        bestMarket:        crop.bestMarket,
        estimatedProfit:   crop.estimatedProfitPerAcre || 0,
        growthDuration:    crop.growthDuration || `${crop.growthDurationDays || '?'} days`,
        waterRequirement:  crop.waterRequirement,
        season:            crop.season,
        requirements:      crop.requirements || '',
        riskFactors:       Array.isArray(crop.riskFactors) ? crop.riskFactors : [crop.riskFactors || ''],
        mitigationTips:    crop.mitigationTips || [],
        soilFitReasons:    crop.soilFitReasons || [],
        marketFitReasons:  crop.marketFitReasons || [],
        weatherFitReasons: crop.weatherFitReasons || [],
        governmentSchemes: crop.governmentSchemes || [],
      }));

      // Save to Supabase with full crop details
      await saveAnalysis(soilData.analysis, wxData, recData, mktData, location, mappedCrops);
      setActiveTab('recommendations');

    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSoilImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setSoilImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const restoreFromHistory = (rec) => {
    setAnalysis({
      soilType: rec.soil_type, confidence: rec.confidence, ph: rec.ph,
      nitrogen: rec.nitrogen, phosphorus: rec.phosphorus, potassium: rec.potassium,
      organicMatter: rec.organic_matter, moisture: rec.moisture, drainage: rec.drainage,
      recommendations: rec.soil_recommendations || [],
    });
    setMarketData({ nearbyMarkets: [], topCrops: rec.top_crops || [] });
    setWeatherData({ current: { temp: rec.weather_temp, condition: rec.weather_condition, humidity: rec.weather_humidity }, forecast: [], seasonal: rec.weather_advisory });
    setLocation(rec.location);
    setActiveTab('recommendations');
  };

  const getTrendIcon  = (t) => t === 'up' ? '↗' : t === 'down' ? '↘' : '→';
  const getTrendColor = (t) => t === 'up' ? '#10b981' : t === 'down' ? '#ef4444' : '#6b7280';

  // ── Loading ──
  if (authLoading) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#1a4d2e,#2d5a3d)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ fontSize: '4rem' }}>🌾</div>
      <Loader size={36} color="#8bc34a" style={{ animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  // ── Auth Gate ──
  if (!user) return <AuthPage onAuth={setUser} />;

  // ── Main App ──
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#1a4d2e 0%,#2d5a3d 50%,#1a3a2e 100%)', fontFamily: '"Quicksand","Segoe UI",sans-serif', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `radial-gradient(circle at 20% 30%, rgba(139,195,74,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,235,59,0.08) 0%, transparent 50%)`, pointerEvents: 'none' }} />

      {/* Header */}
      <header style={{ background: 'rgba(26,77,46,0.95)', backdropFilter: 'blur(10px)', borderBottom: '3px solid #8bc34a', padding: '1rem 2rem', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '46px', height: '46px', background: 'linear-gradient(135deg,#8bc34a,#689f38)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', boxShadow: '0 4px 15px rgba(139,195,74,0.4)' }}>🌾</div>
            <div>
              <h1 style={{ color: '#fff', margin: 0, fontSize: '1.7rem', fontWeight: 700 }}>FarmWise Advisor</h1>
              <p style={{ color: '#8bc34a', margin: 0, fontSize: '0.85rem', fontWeight: 500 }}>Smart Farming, Better Profits</p>
            </div>
          </div>

          {/* User info + sign out */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {saveStatus === 'saving' && <span style={{ color: '#fff9c4', fontSize: '0.85rem', fontWeight: 600 }}>💾 Saving...</span>}
            {saveStatus === 'saved'  && <span style={{ color: '#a5d6a7', fontSize: '0.85rem', fontWeight: 600 }}>✅ Saved!</span>}
            {saveStatus === 'error'  && <span style={{ color: '#ef9a9a', fontSize: '0.85rem', fontWeight: 600 }}>⚠️ Save failed</span>}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.12)', padding: '0.5rem 1rem', borderRadius: '25px' }}>
              <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg,#8bc34a,#558b2f)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={16} color="#fff" />
              </div>
              <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600, maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.user_metadata?.full_name || user.email}
              </span>
            </div>

            <button onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239,83,80,0.2)', border: '1.5px solid rgba(239,83,80,0.4)', borderRadius: '10px', padding: '0.5rem 1rem', color: '#ff8a80', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,83,80,0.35)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,83,80,0.2)'; }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {[
            { id: 'soil-analysis',   label: 'Soil Analysis',       icon: Camera },
            { id: 'recommendations', label: 'Crop Recommendations', icon: TrendingUp },
            { id: 'weather',         label: 'Weather',              icon: Cloud },
            { id: 'markets',         label: 'Market Prices',        icon: DollarSign },
            { id: 'history',         label: 'My History',           icon: History },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: '1 1 160px', padding: '1rem 1.25rem', background: isActive ? 'linear-gradient(135deg,#8bc34a,#689f38)' : 'rgba(255,255,255,0.1)', border: isActive ? '2px solid #8bc34a' : '2px solid rgba(255,255,255,0.2)', borderRadius: '14px', color: '#fff', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem', justifyContent: 'center', transition: 'all 0.3s', boxShadow: isActive ? '0 8px 25px rgba(139,195,74,0.4)' : 'none', transform: isActive ? 'translateY(-2px)' : 'translateY(0)', fontFamily: 'inherit' }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background='rgba(255,255,255,0.15)'; e.currentTarget.style.transform='translateY(-2px)'; }}}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.transform='translateY(0)'; }}}
              ><Icon size={18} />{tab.label}</button>
            );
          })}
        </div>

        {/* ── SOIL ANALYSIS TAB ── */}
        {activeTab === 'soil-analysis' && (
          <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
            <h2 style={{ fontSize: '1.9rem', color: '#1a4d2e', marginBottom: '1.5rem', fontWeight: 700 }}>Upload Soil Image for Analysis</h2>

            {errorMsg && <div style={{ background: '#ffebee', border: '2px solid #ef5350', borderRadius: '12px', padding: '1rem 1.5rem', marginBottom: '1.5rem', color: '#c62828', fontWeight: 600 }}>⚠️ {errorMsg}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '2rem', marginBottom: '2rem' }}>
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '280px', border: '3px dashed #8bc34a', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.3s', background: soilImagePreview ? `url(${soilImagePreview}) center/cover` : 'linear-gradient(135deg,#f1f8e9,#dcedc8)', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={e => { if (!soilImagePreview) { e.currentTarget.style.borderColor='#558b2f'; e.currentTarget.style.transform='scale(1.02)'; }}}
              onMouseLeave={e => { if (!soilImagePreview) { e.currentTarget.style.borderColor='#8bc34a'; e.currentTarget.style.transform='scale(1)'; }}}
              >
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                {!soilImagePreview && (<><Upload size={44} color="#8bc34a" style={{ marginBottom: '1rem' }} /><p style={{ color: '#1a4d2e', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Click to upload soil image</p><p style={{ color: '#689f38', fontSize: '0.9rem', marginTop: '0.5rem' }}>JPG, PNG or JPEG</p></>)}
                {soilImagePreview && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(26,77,46,0.9)', padding: '0.75rem', color: '#fff', textAlign: 'center', fontWeight: 600 }}>✓ Image uploaded — Click to change</div>}
              </label>

              <div>
                <label style={{ display: 'block', color: '#1a4d2e', fontSize: '1rem', fontWeight: 700, marginBottom: '0.6rem' }}>
                  <MapPin size={18} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle' }} />Your Location
                </label>
                <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g., Pune"
                  style={{ width: '100%', padding: '0.875rem 1.25rem', fontSize: '1rem', border: '2px solid #8bc34a', borderRadius: '12px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  onFocus={e => { e.target.style.borderColor='#558b2f'; e.target.style.boxShadow='0 4px 20px rgba(139,195,74,0.25)'; }}
                  onBlur={e  => { e.target.style.borderColor='#8bc34a'; e.target.style.boxShadow='none'; }}
                />
                <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'linear-gradient(135deg,#fff9c4,#fff59d)', borderRadius: '14px', borderLeft: '4px solid #fbc02d' }}>
                  <h4 style={{ color: '#f57f17', margin: '0 0 0.6rem', fontSize: '1rem' }}>📋 How it works:</h4>
                  <ol style={{ color: '#6d4c41', margin: 0, paddingLeft: '1.5rem', lineHeight: 1.9, fontSize: '0.95rem' }}>
                    <li>Upload a clear image of your soil</li>
                    <li>Enter your city name</li>
                    <li>EfficientNet-B2 detects soil type</li>
                    <li>RandomForest recommends best crops</li>
                    <li>Results saved to your account 💾</li>
                  </ol>
                </div>
              </div>
            </div>

            <button onClick={analyzeSoil} disabled={analyzing} style={{ width: '100%', padding: '1.4rem', background: analyzing ? '#9e9e9e' : 'linear-gradient(135deg,#8bc34a,#558b2f)', border: 'none', borderRadius: '16px', color: '#fff', fontSize: '1.2rem', fontWeight: 800, cursor: analyzing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', boxShadow: analyzing ? 'none' : '0 8px 25px rgba(139,195,74,0.4)', transition: 'all 0.3s', fontFamily: 'inherit' }}
            onMouseEnter={e => { if (!analyzing) e.currentTarget.style.transform='scale(1.01)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; }}
            >
              {analyzing ? <><Loader size={24} style={{ animation: 'spin 1s linear infinite' }} />Analyzing Soil...</> : <><Leaf size={24} />Analyze &amp; Get Recommendations</>}
            </button>

            {analysis && (
              <div style={{ marginTop: '2.5rem', padding: '2rem', background: 'linear-gradient(135deg,#e8f5e9,#c8e6c9)', borderRadius: '20px', border: '2px solid #8bc34a' }}>
                <h3 style={{ color: '#1b5e20', fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CheckCircle size={26} color="#4caf50" />Soil Analysis Results
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  {[
                    { label: 'Soil Type',     value: analysis.soilType,                                     icon: '🌱' },
                    { label: 'Confidence',    value: analysis.confidence ? `${analysis.confidence}%` : '—', icon: '🎯' },
                    { label: 'pH Level',      value: analysis.ph,                                            icon: '⚗️' },
                    { label: 'Nitrogen',      value: analysis.nitrogen,                                      icon: '🔬' },
                    { label: 'Phosphorus',    value: analysis.phosphorus,                                    icon: '💎' },
                    { label: 'Potassium',     value: analysis.potassium,                                     icon: '⚡' },
                    { label: 'Organic Matter',value: analysis.organicMatter,                                 icon: '🍂' },
                    { label: 'Moisture',      value: analysis.moisture,                                      icon: '💧' },
                  ].map((item, i) => (
                    <div key={i} style={{ background: '#fff', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', transition: 'transform 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.transform='translateY(-3px)'}
                    onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
                      <div style={{ fontSize: '1.6rem', marginBottom: '0.4rem' }}>{item.icon}</div>
                      <div style={{ color: '#689f38', fontSize: '0.78rem', fontWeight: 700 }}>{item.label}</div>
                      <div style={{ color: '#1b5e20', fontWeight: 700, marginTop: '0.2rem' }}>{item.value || '—'}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px' }}>
                  <h4 style={{ color: '#1b5e20', margin: '0 0 0.75rem', fontSize: '1.1rem' }}>🎯 Key Recommendations:</h4>
                  <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#2e7d32', lineHeight: 2 }}>
                    {(analysis.recommendations || []).map((rec, i) => <li key={i}>{rec}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── RECOMMENDATIONS TAB ── */}
        {activeTab === 'recommendations' && marketData && (
          <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
            <h2 style={{ fontSize: '1.9rem', color: '#1a4d2e', marginBottom: '0.5rem', fontWeight: 700 }}>Recommended Crops for Maximum Profit</h2>
            <p style={{ color: '#689f38', marginBottom: '2rem' }}>Based on your soil analysis, weather, and current market trends</p>
            {(marketData.topCrops || []).map((crop, index) => (
              <div key={index} style={{ background: index === 0 ? 'linear-gradient(135deg,#fff9c4,#fff59d)' : 'linear-gradient(135deg,#f1f8e9,#dcedc8)', borderRadius: '20px', padding: '2rem', marginBottom: '1.5rem', border: index === 0 ? '3px solid #fbc02d' : '2px solid #8bc34a', position: 'relative', overflow: 'hidden', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateX(6px)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(0,0,0,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateX(0)'; e.currentTarget.style.boxShadow='none'; }}>
                {index === 0 && <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'linear-gradient(135deg,#fbc02d,#f57f17)', color: '#fff', padding: '0.4rem 1rem', borderRadius: '20px', fontWeight: 700, fontSize: '0.85rem' }}>⭐ TOP PICK</div>}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.8rem', color: index === 0 ? '#f57f17' : '#1b5e20', margin: '0 0 1rem', fontWeight: 700 }}>{crop.name}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                      {[
                        { label: 'Suitability',     value: `${crop.suitability}%`,                          color: index===0?'#f57f17':'#1b5e20', big: true },
                        { label: 'Est. Profit/Acre', value: `₹${(crop.estimatedProfit||0).toLocaleString()}`, color: '#4caf50', big: true },
                        { label: 'Growth Period',   value: crop.growthDuration,                              color: '#1b5e20', big: false },
                        { label: 'Best Market',     value: crop.bestMarket,                                  color: '#1b5e20', big: false },
                      ].map((s, si) => (
                        <div key={si}>
                          <div style={{ color: '#689f38', fontSize: '0.8rem', fontWeight: 700 }}>{s.label}</div>
                          <div style={{ fontSize: s.big ? '1.8rem' : '1.1rem', fontWeight: 700, color: s.color, marginTop: s.big ? 0 : '0.4rem' }}>{s.value}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', marginBottom: '1rem' }}>
                      <h4 style={{ color: '#1b5e20', margin: '0 0 0.75rem', fontWeight: 700 }}>✅ Why {crop.name}?</h4>
                      <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#2e7d32', lineHeight: 2 }}>
                        {(crop.reasons||[]).map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div style={{ background: 'rgba(139,195,74,0.2)', padding: '1rem', borderRadius: '12px', borderLeft: '4px solid #8bc34a' }}>
                        <div style={{ color: '#558b2f', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>Requirements</div>
                        <div style={{ color: '#33691e', fontSize: '0.9rem' }}>{crop.requirements}</div>
                      </div>
                      <div style={{ background: 'rgba(255,152,0,0.15)', padding: '1rem', borderRadius: '12px', borderLeft: '4px solid #ff9800' }}>
                        <div style={{ color: '#e65100', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>⚠️ Risk Factors</div>
                        <div style={{ color: '#bf360c', fontSize: '0.9rem' }}>{crop.riskFactors}</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '14px', minWidth: '160px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                      {crop.name==='Rice'?'🌾':crop.name==='Cotton'?'🌼':crop.name==='Wheat'?'🌽':crop.name==='Orange'?'🍊':crop.name==='Pomegranate'?'🍎':crop.name==='Mango'?'🥭':crop.name==='Banana'?'🍌':crop.name==='Coconut'?'🥥':crop.name==='Coffee'?'☕':'🌿'}
                    </div>
                    <div style={{ color: '#689f38', fontSize: '0.85rem', fontWeight: 600 }}>Best Price</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1b5e20' }}>₹{crop.bestPrice}</div>
                    <div style={{ color: '#9e9e9e', fontSize: '0.8rem', marginBottom: '0.75rem' }}>per quintal</div>
                    <div style={{ background: 'linear-gradient(135deg,#4caf50,#388e3c)', color: '#fff', padding: '0.6rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem' }}>Avg: ₹{crop.avgPrice}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── WEATHER TAB ── */}
        {activeTab === 'weather' && weatherData && (
          <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
            <h2 style={{ fontSize: '1.9rem', color: '#1a4d2e', marginBottom: '1.5rem', fontWeight: 700 }}>Weather Forecast</h2>
            <div style={{ background: 'linear-gradient(135deg,#4fc3f7,#29b6f6)', borderRadius: '20px', padding: '2rem', color: '#fff', marginBottom: '2rem', boxShadow: '0 8px 25px rgba(79,195,247,0.4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>Current Weather</div>
                  <div style={{ fontSize: '3.5rem', fontWeight: 800 }}>{weatherData.current.temp}°C</div>
                  <div style={{ fontSize: '1.2rem' }}>{weatherData.current.condition}</div>
                </div>
                <div style={{ fontSize: '5rem' }}>{(weatherData.current.condition||'').includes('Cloud')?'⛅':(weatherData.current.condition||'').includes('Rain')?'🌧️':'☀️'}</div>
              </div>
              <div style={{ marginTop: '1.5rem', padding: '0.875rem', background: 'rgba(255,255,255,0.2)', borderRadius: '10px' }}>💧 Humidity: {weatherData.current.humidity}%</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {(weatherData.forecast||[]).map((day, i) => (
                <div key={i} style={{ background: 'linear-gradient(135deg,#e3f2fd,#bbdefb)', padding: '1.25rem', borderRadius: '14px', textAlign: 'center', border: '2px solid #64b5f6', transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform='translateY(-6px)'}
                onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
                  <div style={{ color: '#1565c0', fontWeight: 700, marginBottom: '0.5rem' }}>{day.day}</div>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{(day.condition||'').includes('Rain')?'🌧️':(day.condition||'').includes('Cloud')?'☁️':'☀️'}</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0d47a1' }}>{day.temp}°C</div>
                  <div style={{ fontSize: '0.8rem', color: '#1976d2', marginBottom: '0.4rem' }}>{day.condition}</div>
                  <div style={{ background: (day.rain||0)>50?'#1976d2':'rgba(25,118,210,0.25)', color: (day.rain||0)>50?'#fff':'#0d47a1', padding: '0.3rem 0.6rem', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 700 }}>💧 {day.rain||0}%</div>
                </div>
              ))}
            </div>
            <div style={{ background: 'linear-gradient(135deg,#fff9c4,#fff59d)', padding: '1.25rem', borderRadius: '14px', border: '2px solid #fbc02d', color: '#f57f17', fontWeight: 700, textAlign: 'center' }}>🌦️ {weatherData.seasonal}</div>
          </div>
        )}

        {/* ── MARKETS TAB ── */}
        {activeTab === 'markets' && marketData && (
          <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
            <h2 style={{ fontSize: '1.9rem', color: '#1a4d2e', marginBottom: '1.5rem', fontWeight: 700 }}>Market Price Comparison</h2>
            {(marketData.nearbyMarkets||[]).map((market, index) => (
              <div key={index} style={{ background: 'linear-gradient(135deg,#f1f8e9,#dcedc8)', borderRadius: '20px', padding: '2rem', marginBottom: '1.5rem', border: '2px solid #8bc34a' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#1b5e20', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><MapPin size={22} color="#8bc34a" />{market.name}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem' }}>
                  {(market.crops||[]).map((crop, i) => (
                    <div key={i} style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 8px 20px rgba(0,0,0,0.12)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 10px rgba(0,0,0,0.08)'; }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <div style={{ fontWeight: 700, color: '#1b5e20' }}>{crop.name}</div>
                        <div style={{ color: getTrendColor(crop.trend), fontWeight: 700 }}>{getTrendIcon(crop.trend)}</div>
                      </div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2e7d32' }}>₹{crop.price}</div>
                      <div style={{ color: '#689f38', fontSize: '0.8rem', marginBottom: '0.75rem' }}>per quintal</div>
                      <div style={{ background: ['High','Very High'].includes(crop.demand)?'rgba(76,175,80,0.15)':'rgba(158,158,158,0.15)', color: ['High','Very High'].includes(crop.demand)?'#2e7d32':'#616161', padding: '0.3rem 0.6rem', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 700, display: 'inline-block' }}>{crop.demand} Demand</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── HISTORY TAB ── */}
        {activeTab === 'history' && (
          <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
            <HistoryPanel userId={user.id} onRestore={restoreFromHistory} />
          </div>
        )}

        {!analysis && !['soil-analysis','history'].includes(activeTab) && (
          <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '24px', padding: '4rem 2rem', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
            <AlertCircle size={60} color="#8bc34a" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.7rem', color: '#1a4d2e', fontWeight: 700, marginBottom: '0.75rem' }}>No Analysis Available</h3>
            <p style={{ color: '#689f38', marginBottom: '2rem' }}>Please upload a soil image and run the analysis first</p>
            <button onClick={() => setActiveTab('soil-analysis')} style={{ padding: '0.875rem 2rem', background: 'linear-gradient(135deg,#8bc34a,#558b2f)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'inherit' }}>
              Go to Soil Analysis <ArrowRight size={18} />
            </button>
          </div>
        )}
      </main>

      <footer style={{ background: 'rgba(26,77,46,0.95)', borderTop: '2px solid #8bc34a', padding: '1.5rem 2rem', marginTop: '3rem', textAlign: 'center' }}>
        <p style={{ color: '#8bc34a', margin: 0 }}>🌾 Empowering farmers with AI-driven insights — Powered by EfficientNet-B2 + RandomForest</p>
        <p style={{ color: 'rgba(139,195,74,0.6)', margin: '0.4rem 0 0', fontSize: '0.85rem' }}>Made with ❤️ for farmers</p>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700;800&display=swap');
        @keyframes fadeIn  { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin    { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
};

export default FarmWiseAdvisor;
