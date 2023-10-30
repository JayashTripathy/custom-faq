import { formSchema } from '@/lib/validators/editFaqForm'
import React from 'react'
import { z } from 'zod'

function FaqSection(props: z.infer<typeof formSchema>) {
    console.log("props", props)
  return (
    <div>FaqSection</div>
  )
}

export default FaqSection