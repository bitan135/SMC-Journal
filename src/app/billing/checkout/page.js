'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, ShieldCheck, Sparkles, CreditCard, Tag, User, MapPin, 
  ArrowRight, Loader2, Check, AlertCircle, Zap, Crown
} from 'lucide-react';
import Link from 'next/link';
import { profileService } from '@/lib/storage';

const planDetails = {
  pro: { name: 'Pro Trader', price: 20, icon: Zap, color: '#6366F1' },
  lifetime: { name: 'Legacy Hero', price: 50, icon: Crown, color: '#10B981' }
};

function CheckoutFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan') || 'pro';
  const plan = planDetails[planId] || planDetails.pro;
  
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [discount, setDiscount] = useState(0);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    country: 'United States',
  });

  useEffect(() => {
    async function loadUser() {
      const profile = await profileService.getProfile();
      if (profile) {
        setFormData(prev => ({
          ...prev,
          fullName: profile.full_name || '',
          email: profile.email || '',
        }));
      }
    }
    loadUser();
  }, []);

  const handleApplyCoupon = () => {
    setCouponError('');
    if (coupon.toUpperCase() === 'SMC2026') {
      setDiscount(plan.price * 0.2); // 20% discount
    } else {
      setCouponError('Invalid or expired coupon code.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        body: JSON.stringify({ 
          planId,
          billingDetails: formData,
          coupon: discount > 0 ? coupon : null
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      const payment = await res.json();
      if (payment.payment_id) {
        // Correcting use of checkout vs billing/checkout based on consolidated route
        router.push(`/billing/checkout?id=${payment.payment_id}`);
      } else {
        throw new Error(payment.error || 'Initiation failed');
      }
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  const finalPrice = Math.max(0, plan.price - discount);

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-10 max-w-6xl mx-auto animate-fade-in relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-[var(--accent)]/5 blur-[120px] rounded-full animate-float pointer-events-none"></div>
      
      <Link 
        href="/billing"
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-effect border-[var(--glass-border)] text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.2em] mb-12 hover:text-[var(--foreground)] transition-all group w-fit relative z-10"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Change Plan
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Billing Form */}
        <div className="lg:col-span-7">
          <div className="glass-card rounded-[48px] border-[var(--glass-border)] overflow-hidden shadow-premium">
            <div className="p-8 border-b border-[var(--glass-border)] bg-[var(--glass-bg)] flex items-center justify-between">
              <h2 className="text-[11px] font-black text-[var(--foreground)] uppercase tracking-[0.4em] flex items-center gap-3">
                <CreditCard className="text-[var(--accent)]" size={16} /> Billing Profile
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                    <input
                      required
                      type="text"
                      className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl pl-12 pr-6 py-4 text-sm font-bold text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-all shadow-inner"
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Account Email</label>
                  <input
                    required
                    readOnly
                    type="email"
                    className="w-full bg-[var(--background)] border border-[var(--glass-border)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--text-secondary)]"
                    value={formData.email}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Billing Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                    <input
                      required
                      type="text"
                      className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl pl-12 pr-6 py-4 text-sm font-bold text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-all shadow-inner"
                      placeholder="Street address, apartment, suite"
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">City</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-all shadow-inner"
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Country</label>
                  <select
                    className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl px-6 py-4 text-sm font-black text-[var(--foreground)] appearance-none outline-none focus:border-[var(--accent)] transition-all shadow-inner"
                    value={formData.country}
                    onChange={e => setFormData({...formData, country: e.target.value})}
                  >
                    <option value="Afghanistan">Afghanistan</option>
                    <option value="Albania">Albania</option>
                    <option value="Algeria">Algeria</option>
                    <option value="Andorra">Andorra</option>
                    <option value="Angola">Angola</option>
                    <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Armenia">Armenia</option>
                    <option value="Australia">Australia</option>
                    <option value="Austria">Austria</option>
                    <option value="Azerbaijan">Azerbaijan</option>
                    <option value="Bahamas">Bahamas</option>
                    <option value="Bahrain">Bahrain</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Barbados">Barbados</option>
                    <option value="Belarus">Belarus</option>
                    <option value="Belgium">Belgium</option>
                    <option value="Belize">Belize</option>
                    <option value="Benin">Benin</option>
                    <option value="Bhutan">Bhutan</option>
                    <option value="Bolivia">Bolivia</option>
                    <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                    <option value="Botswana">Botswana</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Brunei">Brunei</option>
                    <option value="Bulgaria">Bulgaria</option>
                    <option value="Burkina Faso">Burkina Faso</option>
                    <option value="Burundi">Burundi</option>
                    <option value="Cabo Verde">Cabo Verde</option>
                    <option value="Cambodia">Cambodia</option>
                    <option value="Cameroon">Cameroon</option>
                    <option value="Canada">Canada</option>
                    <option value="Central African Republic">Central African Republic</option>
                    <option value="Chad">Chad</option>
                    <option value="Chile">Chile</option>
                    <option value="China">China</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Comoros">Comoros</option>
                    <option value="Congo">Congo</option>
                    <option value="Costa Rica">Costa Rica</option>
                    <option value="Croatia">Croatia</option>
                    <option value="Cuba">Cuba</option>
                    <option value="Cyprus">Cyprus</option>
                    <option value="Czech Republic">Czech Republic</option>
                    <option value="Denmark">Denmark</option>
                    <option value="Djibouti">Djibouti</option>
                    <option value="Dominica">Dominica</option>
                    <option value="Dominican Republic">Dominican Republic</option>
                    <option value="Ecuador">Ecuador</option>
                    <option value="Egypt">Egypt</option>
                    <option value="El Salvador">El Salvador</option>
                    <option value="Equatorial Guinea">Equatorial Guinea</option>
                    <option value="Eritrea">Eritrea</option>
                    <option value="Estonia">Estonia</option>
                    <option value="Eswatini">Eswatini</option>
                    <option value="Ethiopia">Ethiopia</option>
                    <option value="Fiji">Fiji</option>
                    <option value="Finland">Finland</option>
                    <option value="France">France</option>
                    <option value="Gabon">Gabon</option>
                    <option value="Gambia">Gambia</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Germany">Germany</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Greece">Greece</option>
                    <option value="Grenada">Grenada</option>
                    <option value="Guatemala">Guatemala</option>
                    <option value="Guinea">Guinea</option>
                    <option value="Guinea-Bissau">Guinea-Bissau</option>
                    <option value="Guyana">Guyana</option>
                    <option value="Haiti">Haiti</option>
                    <option value="Honduras">Honduras</option>
                    <option value="Hungary">Hungary</option>
                    <option value="Iceland">Iceland</option>
                    <option value="India">India</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Iran">Iran</option>
                    <option value="Iraq">Iraq</option>
                    <option value="Ireland">Ireland</option>
                    <option value="Israel">Israel</option>
                    <option value="Italy">Italy</option>
                    <option value="Jamaica">Jamaica</option>
                    <option value="Japan">Japan</option>
                    <option value="Jordan">Jordan</option>
                    <option value="Kazakhstan">Kazakhstan</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Kiribati">Kiribati</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Kyrgyzstan">Kyrgyzstan</option>
                    <option value="Laos">Laos</option>
                    <option value="Latvia">Latvia</option>
                    <option value="Lebanon">Lebanon</option>
                    <option value="Lesotho">Lesotho</option>
                    <option value="Liberia">Liberia</option>
                    <option value="Libya">Libya</option>
                    <option value="Liechtenstein">Liechtenstein</option>
                    <option value="Lithuania">Lithuania</option>
                    <option value="Luxembourg">Luxembourg</option>
                    <option value="Madagascar">Madagascar</option>
                    <option value="Malawi">Malawi</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Maldives">Maldives</option>
                    <option value="Mali">Mali</option>
                    <option value="Malta">Malta</option>
                    <option value="Marshall Islands">Marshall Islands</option>
                    <option value="Mauritania">Mauritania</option>
                    <option value="Mauritius">Mauritius</option>
                    <option value="Mexico">Mexico</option>
                    <option value="Micronesia">Micronesia</option>
                    <option value="Moldova">Moldova</option>
                    <option value="Monaco">Monaco</option>
                    <option value="Mongolia">Mongolia</option>
                    <option value="Montenegro">Montenegro</option>
                    <option value="Morocco">Morocco</option>
                    <option value="Mozambique">Mozambique</option>
                    <option value="Myanmar">Myanmar</option>
                    <option value="Namibia">Namibia</option>
                    <option value="Nauru">Nauru</option>
                    <option value="Nepal">Nepal</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="Nicaragua">Nicaragua</option>
                    <option value="Niger">Niger</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="North Korea">North Korea</option>
                    <option value="North Macedonia">North Macedonia</option>
                    <option value="Norway">Norway</option>
                    <option value="Oman">Oman</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Palau">Palau</option>
                    <option value="Panama">Panama</option>
                    <option value="Papua New Guinea">Papua New Guinea</option>
                    <option value="Paraguay">Paraguay</option>
                    <option value="Peru">Peru</option>
                    <option value="Philippines">Philippines</option>
                    <option value="Poland">Poland</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Romania">Romania</option>
                    <option value="Russia">Russia</option>
                    <option value="Rwanda">Rwanda</option>
                    <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                    <option value="Saint Lucia">Saint Lucia</option>
                    <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
                    <option value="Samoa">Samoa</option>
                    <option value="San Marino">San Marino</option>
                    <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Senegal">Senegal</option>
                    <option value="Serbia">Serbia</option>
                    <option value="Seychelles">Seychelles</option>
                    <option value="Sierra Leone">Sierra Leone</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Slovakia">Slovakia</option>
                    <option value="Slovenia">Slovenia</option>
                    <option value="Solomon Islands">Solomon Islands</option>
                    <option value="Somalia">Somalia</option>
                    <option value="South Africa">South Africa</option>
                    <option value="South Korea">South Korea</option>
                    <option value="South Sudan">South Sudan</option>
                    <option value="Spain">Spain</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="Sudan">Sudan</option>
                    <option value="Suriname">Suriname</option>
                    <option value="Sweden">Sweden</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="Syria">Syria</option>
                    <option value="Taiwan">Taiwan</option>
                    <option value="Tajikistan">Tajikistan</option>
                    <option value="Tanzania">Tanzania</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Timor-Leste">Timor-Leste</option>
                    <option value="Togo">Togo</option>
                    <option value="Tonga">Tonga</option>
                    <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                    <option value="Tunisia">Tunisia</option>
                    <option value="Turkey">Turkey</option>
                    <option value="Turkmenistan">Turkmenistan</option>
                    <option value="Tuvalu">Tuvalu</option>
                    <option value="Uganda">Uganda</option>
                    <option value="Ukraine">Ukraine</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Uruguay">Uruguay</option>
                    <option value="Uzbekistan">Uzbekistan</option>
                    <option value="Vanuatu">Vanuatu</option>
                    <option value="Vatican City">Vatican City</option>
                    <option value="Venezuela">Venezuela</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Yemen">Yemen</option>
                    <option value="Zambia">Zambia</option>
                    <option value="Zimbabwe">Zimbabwe</option>
                  </select>
                </div>
              </div>

              <div className="pt-8 border-t border-[var(--glass-border)]">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-[var(--accent)] text-white font-black rounded-3xl shadow-2xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all text-sm tracking-[0.2em] uppercase flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      Proceed to Crypto Settlement
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Summary & Coupon */}
        <div className="lg:col-span-5 space-y-8">
          <div className="glass-card rounded-[48px] border-[var(--glass-border)] p-10 shadow-premium">
            <h3 className="text-[11px] font-black text-[var(--foreground)] uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                <ShieldCheck className="text-[var(--accent)]" size={16} /> Final Computation
            </h3>
            
            <div className="flex items-start gap-6 mb-10 p-6 rounded-3xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5`}>
                    <plan.icon size={24} style={{ color: plan.color }} />
                </div>
                <div>
                    <h4 className="text-xl font-black text-[var(--foreground)] tracking-tight">{plan.name}</h4>
                    <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest mt-1">Institutional Upgrade</p>
                </div>
                <div className="ml-auto">
                    <span className="text-xl font-black text-[var(--foreground)]">${plan.price}</span>
                </div>
            </div>

            <div className="space-y-4 mb-10">
                <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-[var(--text-secondary)]">Subtotal</span>
                    <span className="text-[var(--foreground)] font-bold">${plan.price}.00</span>
                </div>
                {discount > 0 && (
                    <div className="flex justify-between items-center text-sm font-medium text-emerald-500">
                        <span className="flex items-center gap-2 italic">
                            <Tag size={12} /> Discount Applied
                        </span>
                        <span className="font-bold">-${discount}.00</span>
                    </div>
                )}
                <div className="h-px bg-[var(--glass-border)] my-2" />
                <div className="flex justify-between items-center">
                    <span className="text-[var(--foreground)] font-black uppercase text-[10px] tracking-widest">Grand Total</span>
                    <span className="text-3xl font-black text-[var(--foreground)] tracking-tighter">${finalPrice}.00</span>
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Sparkles size={12} className="text-amber-500" /> Redemption Token (Coupon)
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="ENTER CODE"
                        className="flex-1 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl px-6 py-4 text-xs font-black text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-all uppercase tracking-widest"
                        value={coupon}
                        onChange={e => setCoupon(e.target.value)}
                    />
                    <button 
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-6 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[10px] font-black uppercase tracking-widest text-[var(--accent)] hover:bg-[var(--accent)]/10 hover:border-[var(--accent)]/30 transition-all active:scale-95"
                    >
                        Apply
                    </button>
                </div>
                {couponError && (
                    <p className="text-[9px] font-black text-rose-500 uppercase flex items-center gap-1.5 mt-2 ml-1">
                        <AlertCircle size={10} /> {couponError}
                    </p>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutFormPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--background)]" />}>
      <CheckoutFormContent />
    </Suspense>
  );
}
