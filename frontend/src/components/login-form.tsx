'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getLogin } from './custom/mobile/ui/ramadani/logic/getLogin';
import z from 'zod';
import { useError } from '@/hooks/useError';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

const formSchema = z.object({
  username: z.string().min(2, 'Minimal 2 karakter'),
  password: z.string().min(5, 'Minimal 5 karakter'),
});

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const route = useRouter();
  const { showError } = useError();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    getLogin(values).then((result) => {
      if (!result.data) {
        showError(result.message);
        return;
      } else {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('role', result.data.role);
        localStorage.setItem('name', result.data.name);
        if (result.data.role === 'admin' || result.data.role === 'pengawas') {
          route.push('/dashboard');
        } else if (result.data.role === 'petugas') {
          route.push('/mobile');
        }
      }
    });

    form.reset();
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0 dark:bg-[#151419] md:h-[60vh]">
        <CardContent className="grid p-0 md:grid-cols-2 h-full ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-6 md:p-8 space-y-6 grid self-center  "
            >
              <div className="text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground">Login to your Arden account</p>
              </div>

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="admin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full mt-5">
                Login
              </Button>
            </form>
          </Form>

          <div className="bg-muted relative hidden md:block">
            <Image
              src="/placeholder.svg"
              alt="Image"
              width={100}
              height={100}
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      <p className="px-6 text-center text-sm text-muted-foreground">
        By clicking continue, you agree to our{' '}
        <a href="#" className="underline">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="underline">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
