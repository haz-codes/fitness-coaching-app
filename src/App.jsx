import { useMemo, useRef, useState } from 'react'

const initialUser = {
  firstName: 'Alex',
  lastName: 'Morgan',
  dob: '2000-05-15',
  nickname: 'Alex',
  companionName: 'Nova',
  companionTitle: 'Your Companion',
}

const workoutPlan = [
  { day: 'Mon', label: 'Strength', done: true, minutes: 40 },
  { day: 'Tue', label: 'Cardio', done: true, minutes: 30 },
  { day: 'Wed', label: 'Recovery', done: false, minutes: 20 },
  { day: 'Thu', label: 'HIIT', done: false, minutes: 25 },
  { day: 'Fri', label: 'Core', done: false, minutes: 20 },
  { day: 'Sat', label: 'Walk', done: false, minutes: 35 },
  { day: 'Sun', label: 'Rest', done: false, minutes: 0 },
]

const sampleMeals = [
  { name: 'Salmon rice bowl', calories: 620, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80' },
  { name: 'Protein smoothie', calories: 340, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80' },
]

const weekGoals = {
  steps: 70000,
  calories: 15400,
}

function App() {
  const [user, setUser] = useState(initialUser)
  const [showSignup, setShowSignup] = useState(true)
  const [steps, setSteps] = useState(6400)
  const [progressValue, setProgressValue] = useState(64)
  const [meals, setMeals] = useState(sampleMeals)
  const fileInputRef = useRef(null)

  const stepGoal = 10000
  const calorieGoal = 2200
  const caloriesEaten = meals.reduce((sum, meal) => sum + Number(meal.calories || 0), 0)
  const stepsRemaining = Math.max(stepGoal - steps, 0)
  const energy = Math.min(100, Math.round((steps / stepGoal) * 100))

  const companionMood = useMemo(() => {
    if (energy >= 85) return { label: 'Happy', emoji: '😊', message: 'I feel energized and ready for another win!' }
    if (energy >= 60) return { label: 'Content', emoji: '🙂', message: 'You are doing great. Keep it going.' }
    if (energy >= 35) return { label: 'Tired', emoji: '😴', message: 'I need a little more movement from you today.' }
    return { label: 'Low energy', emoji: '😵', message: 'Let’s get moving and bring me back to life!' }
  }, [energy])

  const handleSignupChange = (e) => {
    const { name, value } = e.target
    setUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignupSubmit = (e) => {
    e.preventDefault()
    setShowSignup(false)
  }

  const handleStepChange = (e) => {
    const next = Number(e.target.value) || 0
    setSteps(next)
    setProgressValue(Math.min(100, Math.round((next / stepGoal) * 100)))
  }

  const handleMealUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const estimate = Math.max(280, Math.round(Math.random() * 700))
      const foodName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ')
      const newMeal = {
        name: foodName || 'Fresh meal',
        calories: estimate,
        image: reader.result,
      }

      setMeals((prev) => [newMeal, ...prev])
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-badge">T</div>
          <div>
            <p className="eyebrow">Fitness coaching</p>
            <h1>Tracker App</h1>
          </div>
        </div>
        <nav className="nav">
          <a href="#home">Home</a>
          <a href="#dashboard">Dashboard</a>
          <a href="#meal-planner">Meals</a>
          <a href="#profile">Profile</a>
        </nav>
      </header>

      <main className="page">
        <section id="home" className="hero card">
          <div className="hero-copy">
            <span className="pill">Your daily momentum starts here</span>
            <h2>Build a healthier routine with your personal wellness coach.</h2>
            <p>
              A motivating lifestyle app for everyday people who want to move more, eat better,
              and feel stronger every day.
            </p>
            <div className="hero-actions">
              <button className="primary">Start your journey</button>
              <button className="secondary">See the plan</button>
            </div>
            <ul className="hero-points">
              <li>Daily step goals</li>
              <li>Meal tracking with photo calorie estimates</li>
              <li>Coach-style progress overview</li>
            </ul>
          </div>

          <div className="hero-panel">
            <div className="mini-card stat-card">
              <span>Steps today</span>
              <strong>{steps.toLocaleString()}</strong>
              <small>Goal: {stepGoal.toLocaleString()}</small>
            </div>
            <div className="mini-card companion-card">
              <div className="companion-avatar">{companionMood.emoji}</div>
              <div>
                <p>{user.companionTitle}</p>
                <h3>{user.companionName}</h3>
                <small>{companionMood.label}</small>
              </div>
            </div>
          </div>
        </section>

        {showSignup ? (
          <section className="signup card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Create your profile</p>
                <h3>Welcome to Tracker App</h3>
              </div>
            </div>

            <form onSubmit={handleSignupSubmit} className="signup-form">
              <div className="field-grid">
                <label>
                  First name
                  <input name="firstName" value={user.firstName} onChange={handleSignupChange} placeholder="First name" />
                </label>
                <label>
                  Last name
                  <input name="lastName" value={user.lastName} onChange={handleSignupChange} placeholder="Last name" />
                </label>
                <label>
                  Date of birth
                  <input type="date" name="dob" value={user.dob} onChange={handleSignupChange} />
                </label>
                <label>
                  Nickname
                  <input name="nickname" value={user.nickname} onChange={handleSignupChange} placeholder="What should we call you?" />
                </label>
                <label>
                  Companion name
                  <input name="companionName" value={user.companionName} onChange={handleSignupChange} placeholder="Name your companion" />
                </label>
                <label>
                  Companion title
                  <input name="companionTitle" value={user.companionTitle} onChange={handleSignupChange} placeholder="Your Companion" />
                </label>
              </div>

              <button className="primary submit-btn" type="submit">Create my account</button>
            </form>
          </section>
        ) : null}

        <section id="dashboard" className="dashboard-grid">
          <div className="card dashboard-main">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Your dashboard</p>
                <h3>Hi {user.nickname || 'friend'}!</h3>
              </div>
              <button className="secondary small">+ Add workout</button>
            </div>

            <div className="energy-panel">
              <div className="companion-figure">
                <div className="mood-bubble">{companionMood.emoji}</div>
                <div>
                  <p>{user.companionTitle}</p>
                  <h4>{user.companionName}</h4>
                </div>
              </div>

              <div className="energy-meter">
                <div className="meter-head">
                  <span>Energy</span>
                  <strong>{energy}%</strong>
                </div>
                <div className="meter-bar">
                  <span style={{ width: `${energy}%` }} />
                </div>
                <small>{companionMood.message}</small>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-box">
                <span>Steps</span>
                <strong>{steps.toLocaleString()}</strong>
                <small>{stepsRemaining.toLocaleString()} left</small>
              </div>
              <div className="stat-box">
                <span>Calories</span>
                <strong>{caloriesEaten}</strong>
                <small>{calorieGoal - caloriesEaten} remaining</small>
              </div>
              <div className="stat-box">
                <span>Workout</span>
                <strong>3/5</strong>
                <small>Goal this week</small>
              </div>
            </div>

            <div className="steps-card">
              <div className="meter-head">
                <span>Step goal progress</span>
                <strong>{progressValue}%</strong>
              </div>
              <input
                type="range"
                min="0"
                max={stepGoal}
                value={steps}
                onChange={handleStepChange}
                aria-label="Daily steps"
              />
              <div className="range-labels">
                <small>0</small>
                <small>{stepGoal.toLocaleString()} steps</small>
              </div>
            </div>
          </div>

          <aside className="card side-panel">
            <div className="section-heading tight">
              <div>
                <p className="eyebrow">Workout overview</p>
                <h3>Weekly plan</h3>
              </div>
            </div>

            <div className="workout-list">
              {workoutPlan.map((workout) => (
                <div className={`workout-item ${workout.done ? 'done' : ''}`} key={workout.day}>
                  <div>
                    <strong>{workout.day}</strong>
                    <p>{workout.label}</p>
                  </div>
                  <span>{workout.minutes} min</span>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section id="meal-planner" className="meal-section">
          <div className="card meals-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Nutrition</p>
                <h3>Meal planning</h3>
              </div>
              <button className="secondary small" onClick={() => fileInputRef.current?.click()}>Add meal</button>
              <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleMealUpload} />
            </div>

            <div className="meal-summary">
              <div>
                <span>Calories today</span>
                <strong>{caloriesEaten}</strong>
              </div>
              <div>
                <span>Goal</span>
                <strong>{calorieGoal}</strong>
              </div>
              <div>
                <span>Weekly goal</span>
                <strong>{weekGoals.calories.toLocaleString()}</strong>
              </div>
            </div>

            <div className="meal-list">
              {meals.map((meal, index) => (
                <article key={`${meal.name}-${index}`} className="meal-item">
                  <img src={meal.image} alt={meal.name} />
                  <div>
                    <h4>{meal.name}</h4>
                    <p>{meal.calories} calories</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="profile" className="card profile-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Account</p>
              <h3>Profile & goals</h3>
            </div>
          </div>

          <div className="profile-layout">
            <div className="profile-identity">
              <div className="avatar-large">{user.nickname?.[0]?.toUpperCase() || 'A'}</div>
              <div>
                <h4>{user.firstName} {user.lastName}</h4>
                <p>Nickname: {user.nickname}</p>
                <p>Companion: {user.companionName}</p>
              </div>
            </div>

            <div className="profile-goals">
              <div>
                <span>Goal</span>
                <strong>Build consistency</strong>
              </div>
              <div>
                <span>Birth date</span>
                <strong>{user.dob}</strong>
              </div>
              <div>
                <span>Preferred coach energy</span>
                <strong>Encouraging & realistic</strong>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
