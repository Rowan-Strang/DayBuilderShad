import { ChangeEvent, FormEvent, useState } from 'react'
import { useAddEvent } from '../hooks/events.ts'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addEvent } from '@/apis/events.ts'
import { EventData } from 'models/events.ts'

function AddEvent() {
  // const { data, isPending, isError, error } = useAddEvent()
  //   const [{title, location, date, start, end, locked} setFormValues,
  //   ] = useState({
  // title:'',
  // location: '',
  // date: '2024-12-28',
  // start: '',
  // end: '',
  // locked: false
  //   })

  const [formValues, setFormValues] = useState({
    title: '',
    location: '',
    date: '2024-12-28',
    start: '',
    end: '',
    locked: false,
  })

  const { title, location, date, start, end, locked } = formValues

  const queryClient = useQueryClient()

  const addMutation = useMutation({
    mutationFn: async (event: EventData) => addEvent(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })

  const onChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.currentTarget
    setFormValues((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const onCheckBoxChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = evt.currentTarget
    setFormValues((previous) => ({
      ...previous,
      [name]: checked,
    }))
  }

  const onSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()

    await addMutation.mutate({
      title: title,
      location,
      date,
      start,
      end,
      locked,
    })
  }
  return (
    <>
      <form className="form" onSubmit={onSubmit} aria-label="Add Event">
        <div>
          <label htmlFor="title">Event: </label>
          <input
            className="form__input"
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor="location">Address: </label>
          <input
            type="text"
            name="location"
            id="location"
            value={location}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor="start">Starting: </label>
          <input
            type="time"
            name="start"
            id="start"
            value={start}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor="locked">Lock Start Time</label>
          <input
            type="checkbox"
            name="locked"
            id="locked"
            checked={locked}
            onChange={onCheckBoxChange}
          />
        </div>
        <button type="submit" className="button-primary">
          Add Event
        </button>
      </form>
    </>
  )
}

export default AddEvent
