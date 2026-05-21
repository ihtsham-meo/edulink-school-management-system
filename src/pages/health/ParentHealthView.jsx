import { HeartPulse } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import { mockHealthRecords } from '../../data/mockData'

const bloodGroupColors = {
  'A+': 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950',
  'B+': 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950',
  'O+': 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950',
  'AB+':'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950',
  'B-': 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950',
}

function ParentHealthView() {
  // Simulate child = Ali Hassan
  const record = mockHealthRecords.find(r => r.studentId === 1)

  if (!record) return (
    <div className="flex items-center justify-center py-20">
      <p className="text-light-text-secondary dark:text-dark-text-secondary">No health records found.</p>
    </div>
  )

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Health Records" subtitle="Your child's medical information" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Basic info */}
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-4 flex items-center gap-2">
            <HeartPulse size={15} className="text-accent" />
            Basic Health Info
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">Blood Group</p>
              <span className={`text-sm font-bold px-2 py-0.5 rounded-lg ${bloodGroupColors[record.bloodGroup] || 'text-accent bg-accent/10'}`}>
                {record.bloodGroup}
              </span>
            </div>
            <div>
              <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">Height / Weight</p>
              <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">{record.height}cm / {record.weight}kg</p>
            </div>
            <div>
              <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">Conditions</p>
              <div className="flex flex-wrap gap-1">
                {record.conditions.length > 0
                  ? record.conditions.map(c => (
                    <span key={c} className="text-xs px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 font-medium">{c}</span>
                  ))
                  : <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">None</span>
                }
              </div>
            </div>
            <div>
              <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">Allergies</p>
              <div className="flex flex-wrap gap-1">
                {record.allergies.length > 0
                  ? record.allergies.map(a => (
                    <span key={a} className="text-xs px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 font-medium">{a}</span>
                  ))
                  : <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">None</span>
                }
              </div>
            </div>
          </div>
        </div>

        {/* Emergency contact */}
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">Emergency Contact</h3>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Doctor',    value: record.emergencyDoctor },
              { label: 'Phone',     value: record.emergencyPhone  },
              { label: 'Hospital',  value: record.hospital        },
            ].map(item => (
              <div key={item.label}>
                <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">{item.label}</p>
                <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Vaccinations */}
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">Vaccination Records</h3>
          {record.vaccinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {record.vaccinations.map((v, i) => (
                <div key={i} className="bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg p-3">
                  <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">{v.name}</p>
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-1">Given: {v.date}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">Next due: {v.nextDue}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">No vaccination records</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ParentHealthView