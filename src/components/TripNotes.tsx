import { useState } from 'react'
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface TripNotesProps {
  tripId: string
  initialNotes?: string
  onSave: (notes: string) => Promise<void>
}

export function TripNotes({ tripId: _tripId, initialNotes = '', onSave }: TripNotesProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [notes, setNotes] = useState(initialNotes)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(notes)
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving notes:', error)
      alert('Failed to save notes')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setNotes(initialNotes)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Trip Notes</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
              title="Save notes"
            >
              <CheckIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              title="Cancel"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes about your trip... (e.g., must-see places, restaurant recommendations, travel tips)"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
          rows={6}
          disabled={saving}
        />
        <p className="mt-2 text-sm text-gray-500">
          {notes.length} characters
        </p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Trip Notes</h3>
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          title="Edit notes"
        >
          <PencilIcon className="h-5 w-5" />
        </button>
      </div>
      {notes ? (
        <p className="text-gray-700 whitespace-pre-wrap">{notes}</p>
      ) : (
        <p className="text-gray-500 italic">No notes yet. Click the edit button to add notes about your trip.</p>
      )}
    </div>
  )
}

