'use server';
 
//ac z
import { z } from 'zod';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

//ac z
const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
     invalid_type_error: 'Please select a customer.',
    }), // removed and customized on val 1=> customerId: z.string(),
    amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),// removed and customized on val 1=> amount: z.coerce.number(),
    status: z.enum(['pending', 'paid'], {
      invalid_type_error: 'Please select an invoice status.',
    }),// removed and customized on val 1=> status: z.enum(['pending', 'paid']),
    date: z.string(),
  });

//ac z
const CreateInvoice = FormSchema.omit({ id: true, date: true });
//export async function createInvoice(formData: FormData) {}
//export async function createInvoice(formData: FormData) { //customized on val 1

 // 
  export type State = {
    errors?: {
      customerId?: string[];
      amount?: string[];
      status?: string[];
    };
    message?: string | null;
  };
   
  export async function createInvoice(prevState: State, formData: FormData) {
    console.log('Hello Submition');

    //ac z

    // Validate form using Zod
   // const { customerId, amount, status } = CreateInvoice.parse({ //customized on val 1
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
      });

    // If form validation fails, return errors early. Otherwise, continue. //customized on val 1
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Invoice.',
      };
    }

    // Prepare data for insertion into the database //customized on val 1
    const { customerId, amount, status } = validatedFields.data;

    //ac z
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    // Insert data into the database
    try{
        await sql `INSERT INTO invoices (customer_id, amount, status, date) VALUES (${customerId}, ${amountInCents}, ${status}, ${date})`;
    }catch (error) {

      // If a database error occurs, return a more specific error.
        return { message: 'Database Error: Failed to Create Invoice.' };
      }

    // Revalidate the cache for the invoices page and redirect the user. 
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
    {/* remove for ac z
    const rawFormData = {
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    };
    // Test it out:
    console.log('Hello Submission Collect');
    console.log(typeof rawFormData.amount);
    console.log(rawFormData);
    console.log('Hello Submission Ended');
  */}
}

//sa 1
// Use Zod to update the expected types 
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
 
// sa 1...
 
export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  const amountInCents = amount * 100;
  try {
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
    `;
  }catch(error) {
    return { message: 'Database Error: Failed to Update Invoice.'};
 }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

//sa 2
export async function deleteInvoice(id: string) {
    throw new Error('Failed to Delete Invoice');
    try{        

        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');    
        return { message: 'Deleted Invoice' };

    }catch(error){
        return { message: 'Database Error: Failed to Delete Invoice.'};
    }
  }

  export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
      await signIn('credentials', formData);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }