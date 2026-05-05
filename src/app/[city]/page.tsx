import { redirect } from 'next/navigation'

export default function CityRedirect({ params }: { params: { city: string } }) {
  // Default to 'all' locality for the city
  redirect(`/${params.city}/all`)
}
