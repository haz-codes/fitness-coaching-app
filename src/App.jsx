import { useMemo, useRef, useState } from 'react'

const initialUser = {
  firstName: '',
  lastName: '',
  dob: '',
  nickname: '',
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
  { name: 'Salmon rice bowl', calories: 640, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80' },
  { name: 'Protein smoothie', calories: 340, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80' },
]

const stepGoal = 10000
const calorieGoal = 2200

function App() {
  const [user, setUser] = useState(initialUser)
  const [showSignup, setShowSignup] = useState(true)
  const [steps, setSteps] = useState(3800)
  const [meals, setMeals] = useState(sampleMeals)
  const fileInputRef = useRef(null)

  const caloriesEaten = meals.reduce((sum, meal) => sum + Number(meal.calories || 0), 0)
  const remainingCalories = Math.max(calorieGoal - caloriesEaten, 0)
  const remainingSteps = Math.max(stepGoal - steps, 0)
  const energy = Math.min(100, Math.max(0, Math.round((steps / stepGoal) * 100)))

  const companionMood = useMemo(() => {
    if (energy >= 80) {
      return {
        label: 'Happy',
        emoji: '😊',
        message: `${user.companionName} is full of energy and cheering you on.`,
      }
    }

    if (energy >= 50) {
      return {
        label: 'Motivated',
        emoji: '🙂',
        message: `${user.companionName} is feeling stronger. Keep the streak going.`,
      }
    }

    if (energy >= 25) {
      return {
        label: 'Low energy',
        emoji: '😴',
        message: `${user.companionName} needs a little more movement today.`,
      }
    }

    return {
      label: 'Exhausted',
      emoji: '😵',
      message: `${user.companionName} is tired. Let’s get moving and bring the energy back.`,
    }
  }, [energy, user.companionName])

  const handleSignupChange = (event) => {
    const { name, value } = event.target
    setUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignupSubmit = (event) => {
    event.preventDefault()

    if (!user.firstName || !user.lastName || !user.nickname || !user.dob) {
      return
    }

    setShowSignup(false)
  }

  const handleStepChange = (event) => {
    const nextValue = Number(event.target.value) || 0
    setSteps(nextValue)
  }

  const handleMealUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const estimatedCalories = Math.max(220, Math.round(Math.random() * 850))
      const cleanedName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]+/g, ' ')
        .trim()

      const newMeal = {
        name: cleanedName || 'Fresh meal',
        calories: estimatedCalories,
        image: reader.result,
      }

      setMeals((prev) => [newMeal, ...prev])
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  return (
    <div className="tracker-app">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark">T</div>
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

      <main className="page-shell">
        <section id="home" className="hero card-panel">
          <div className="hero-copy">
            <span className="pill">Your daily momentum starts here</span>
            <h2>Build a stronger, healthier life with your personal wellness coach.</h2>
            <p>
              Tracker App keeps you moving, helps you eat better, and turns your daily habit
              into a feeling of progress you can actually stick with.
            </p>

            <div className="hero-actions">
              <button className="primary-btn">Start your journey</button>
              <button className="secondary-btn">See the plan</button>
            </div>

            <ul className="feature-list">
              <li>Daily step goals</li>
              <li>Meal tracking with food photos</li>
              <li>Companion motivation and energy</li>
            </ul>
          </div>

          <div className="hero-side">
            <div className="mini-stat card-soft">
              <span>Steps today</span>
              <strong>{steps.toLocaleString()}</strong>
              <small>Goal: {stepGoal.toLocaleString()}</small>
            </div>

            <div className="mini-companion card-soft">
              <div className="companion-avatar">{companionMood.emoji}</div>
              <div>
                <p>{user.companionTitle}</p>
                <h3>{user.companionName || 'Nova'}</h3>
                <small>{companionMood.label}</small>
              </div>
            </div>
          </div>
        </section>

        {showSignup && (
          <section className="signup card-panel">
            <div className="section-header">
              <div>
                <p className="eyebrow">Create your profile</p>
                <h3>Welcome to Tracker App</h3>
              </div>
            </div>

            <form className="signup-form" onSubmit={handleSignupSubmit}>
              <div className="field-grid">
                <label>
                  First name
                  <input
                    type="text"
                    name="firstName"
                    value={user.firstName}
                    onChange={handleSignupChange}
                    placeholder="First name"
                  />
                </label>

                <label>
                  Last name
                  <input
                    type="text"
                    name="lastName"
                    value={user.lastName}
                    onChange={handleSignupChange}
                    placeholder="Last name"
                  />
                </label>

                <label>
                  Date of birth
                  <input
                    type="date"
                    name="dob"
                    value={user.dob}
                    onChange={handleSignupChange}
                  />
                </label>

                <label>
                  Nickname
                  <input
                    type="text"
                    name="nickname"
                    value={user.nickname}
                    onChange={handleSignupChange}
                    placeholder="What should we call you?"
                  />
                </label>

                <label>
                  Companion name
                  <input
                    type="text"
                    name="companionName"
                    value={user.companionName}
                    onChange={handleSignupChange}
                    placeholder="Name your companion"
                  />
                </label>

                <label>
                  Companion title
                  <input
                    type="text"
                    name="companionTitle"
                    value={user.companionTitle}
                    onChange={handleSignupChange}
                    placeholder="Your Companion"
                  />
                </label>
              </div>

              <button type="submit" className="primary-btn submit-btn">Create my account</button>
            </form>
          </section>
        )}

        <section id="dashboard" className="dashboard-grid">
          <div className="card-panel dashboard-panel">
            <div className="section-header">
              <div>
                <p className="eyebrow">Your dashboard</p>
                <h3>Hi {user.nickname || 'friend'}!</h3>
              </div>
              <button className="secondary-btn small-btn">+ Add workout</button>
            </div>

            <div className="energy-panel">
              <div className="companion-summary">
                <div className="mood-avatar">{companionMood.emoji}</div>
                <div>
                  <p>{user.companionTitle || 'Your Companion'}</p>
                  <h4>{user.companionName || 'Nova'}</h4>
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
                <small>{remainingSteps.toLocaleString()} left</small>
              </div>

              <div className="stat-box">
                <span>Calories</span>
                <strong>{caloriesEaten}</strong>
                <small>{remainingCalories} left</small>
              </div>

              <div className="stat-box">
                <span>Workout</span>
                <strong>3/5</strong>
                <small>Goal this week</small>
              </div>
            </div>

            <div className="step-card">
              <div className="meter-head">
                <span>Step goal progress</span>
                <strong>{Math.min(100, Math.round((steps / stepGoal) * 100))}%</strong>
              </div>

              <input
                type="range"
                min="0"
                max={stepGoal}
                step="100"
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

          <aside className="card-panel side-panel">
            <div className="section-header tight">
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
          <div className="card-panel meal-panel">
            <div className="section-header">
              <div>
                <p className="eyebrow">Nutrition</p>
                <h3>Meal planning</h3>
              </div>
              <button className="secondary-btn small-btn" onClick={() => fileInputRef.current?.click()}>
                Add meal
              </button>
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
                <span>Remaining</span>
                <strong>{remainingCalories}</strong>
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

        <section id="profile" className="card-panel profile-card">
          <div className="section-header">
            <div>
              <p className="eyebrow">Account</p>
              <h3>Profile & goals</h3>
            </div>
          </div>

          <div className="profile-layout">
            <div className="profile-identity">
              <div className="profile-avatar">{(user.nickname || 'A').charAt(0).toUpperCase()}</div>
              <div>
                <h4>{user.firstName || 'Your'} {user.lastName || 'Name'}</h4>
                <p>Nickname: {user.nickname || 'your nickname'}</p>
                <p>Companion: {user.companionName || 'Nova'}</p>
              </div>
            </div>

            <div className="profile-goals">
              <div>
                <span>Goal</span>
                <strong>Build consistency</strong>
              </div>
              <div>
                <span>Birth date</span>
                <strong>{user.dob || 'Not set yet'}</strong>
              </div>
              <div>
                <span>Coach style</span>
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
