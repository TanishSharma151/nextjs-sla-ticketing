'use client';

import {
  useEffect,
  useState,
} from 'react';

import { useRouter }
  from 'next/navigation';

import {
  createTicket,
} from '@/services/tickets';

import {
  getMe,
} from '@/services/auth';

import {
  getOrgId,
} from '@/services/organizations';

import { Input }
  from '@/components/ui/input';

import { Button }
  from '@/components/ui/button';

import { Textarea }
  from '@/components/ui/textarea';

import FileUpload
  from '@/components/tickets/file-upload';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// type Policy = {
//   id: string;
//   name: string;
//   priority: string;
// };

export default function CreateTicketPage() {
  const router =
    useRouter();

  const [title, setTitle] =
    useState('');

  const [
    description,
    setDescription,
  ] = useState('');

  const [priority, setPriority] =
    useState('LOW');

  const [loading, setLoading] =
    useState(false);

  const [attachmentUrl, setAttachmentUrl] =
    useState('');

  const [orgId, setOrgId] =
    useState('');


  useEffect(() => {
    const init =
      async () => {
        try {
          const user =
            await getMe();

          const fetchedOrgId =
            getOrgId(user);

          if (!fetchedOrgId) {
            console.error(
              'No organization found',
            );

            return;
          }

          setOrgId(
            fetchedOrgId,
          );
        } catch (error) {
          console.error(error);
        }
      };

    init();
  }, []);

  const handleCreate =
    async () => {
      try {
        setLoading(true);

        console.log('Payload:', { title, description, priority, attachmentUrl, orgId }); // 👈 add this


        await createTicket({
          title,
          description,
          priority,
          attachmentUrl,
          orgId
        });

        router.push(
          '/dashboard',
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div
      className="
        h-[calc(100vh-64px)]
        overflow-hidden
        bg-zinc-100
        text-black

        dark:bg-[#09090B]
        dark:text-white
      "
    >
      <div
        className="
          mx-auto
          h-full
          max-w-7xl
          p-4
        "
      >
        <div
          className="
            grid
            h-full
            gap-4

            lg:grid-cols-[1fr_320px]
          "
        >

          {/* LEFT */}
          <div
            className="
              relative
              flex
              h-full
              flex-col
              overflow-hidden
              rounded-3xl
              border border-zinc-200
              bg-white
              p-6
              shadow-sm

              dark:border-white/10
              dark:bg-gradient-to-br
              dark:from-zinc-900
              dark:via-black
              dark:to-zinc-950
            "
          >

            {/* glow */}
            <div
              className="
                absolute right-0 top-0
                h-56 w-56
                rounded-full
                bg-violet-500/10
                blur-3xl
              "
            />

            <div
              className="
                relative z-10
                flex h-full flex-col
              "
            >

              {/* heading */}
              <div className="mb-6 shrink-0">
                <p
                  className="
                    mb-2
                    text-[11px]
                    uppercase
                    tracking-[0.25em]
                    text-zinc-500
                  "
                >
                  SUPPORT PORTAL
                </p>

                <h1
                  className="
                    text-4xl
                    font-bold
                    tracking-tight
                  "
                >
                  Create Ticket
                </h1>

                <p
                  className="
                    mt-2
                    text-sm
                    text-zinc-500

                    dark:text-zinc-400
                  "
                >
                  Submit technical issues,
                  outages, bugs, or
                  support requests.
                </p>
              </div>

              {/* SCROLLABLE FORM */}
              <div
                className="
                  flex-1
                  space-y-5
                  overflow-y-auto
                  pr-2
                "
              >

                {/* upload */}
                <div
                  className="
                    rounded-2xl
                    border border-dashed
                    border-zinc-300
                    bg-zinc-50
                    p-5

                    dark:border-white/10
                    dark:bg-white/[0.02]
                  "
                >
                  <div className="mb-4">
                    <h2 className="font-semibold">
                      Attachments
                    </h2>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-zinc-500
                      "
                    >
                      Upload screenshots,
                      logs, or PDFs
                    </p>
                  </div>

                  <div
                    className="
                      flex min-h-[140px]
                      items-center
                      justify-center
                      rounded-2xl
                      border border-dashed
                      border-zinc-300
                      bg-white
                      px-4

                      dark:border-white/10
                      dark:bg-black/20
                    "
                  >
                    <FileUpload
                      onUploadComplete={
                        setAttachmentUrl
                      }
                    />
                  </div>

                  {attachmentUrl && (
                    <div
                      className="
                        mt-4
                        rounded-xl
                        border border-emerald-500/20
                        bg-emerald-500/10
                        px-3 py-2
                        text-sm
                        text-emerald-600

                        dark:text-emerald-400
                      "
                    >
                      File uploaded successfully
                    </div>
                  )}
                </div>

                {/* title */}
                <div className="space-y-2">
                  <label
                    className="
                      text-sm
                      font-medium
                      text-zinc-700

                      dark:text-zinc-300
                    "
                  >
                    Ticket Title
                  </label>

                  <Input
                    value={title}
                    onChange={(e) =>
                      setTitle(
                        e.target.value,
                      )
                    }
                    placeholder="Production outage..."
                    className="
                      h-12
                      rounded-xl
                      border-zinc-200
                      bg-zinc-50
                      px-4

                      dark:border-white/10
                      dark:bg-black/40
                    "
                  />
                </div>

                {/* description */}
                <div className="space-y-2">
                  <label
                    className="
                      text-sm
                      font-medium
                      text-zinc-700

                      dark:text-zinc-300
                    "
                  >
                    Description
                  </label>

                  <Textarea
                    value={description}
                    onChange={(e) =>
                      setDescription(
                        e.target.value,
                      )
                    }
                    placeholder="Describe the issue..."
                    className="
                      min-h-[120px]
                      rounded-xl
                      border-zinc-200
                      bg-zinc-50
                      p-4

                      dark:border-white/10
                      dark:bg-black/40
                    "
                  />
                </div>

                {/* priority */}
                <div className="space-y-2">
                  <label
                    className="
                      text-sm
                      font-medium
                      text-zinc-700

                      dark:text-zinc-300
                    "
                  >
                    Priority
                  </label>

                  <Select
                    value={priority}
                    onValueChange={
                      setPriority
                    }
                  >
                    <SelectTrigger
                      className="
                        h-12
                        rounded-xl
                        border-zinc-200
                        bg-zinc-50
                        px-4

                        dark:border-white/10
                        dark:bg-black/40
                      "
                    >
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent
                      className="
                        border border-zinc-200
                        bg-white
                        text-black

                        dark:border-white/10
                        dark:bg-zinc-950
                        dark:text-white
                      "
                    >
                      <SelectItem value="LOW">
                        LOW
                      </SelectItem>

                      <SelectItem value="MEDIUM">
                        MEDIUM
                      </SelectItem>

                      <SelectItem value="HIGH">
                        HIGH
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              </div>

              {/* sticky button */}
              <div
                className="
                  shrink-0
                  pt-4
                "
              >
                <Button
                  onClick={
                    handleCreate
                  }
                  disabled={loading}
                  className="
                    h-12
                    w-full
                    rounded-xl
                    bg-black
                    font-semibold
                    text-white
                    hover:bg-zinc-800

                    dark:bg-white
                    dark:text-black
                    dark:hover:bg-zinc-200
                  "
                >
                  {loading
                    ? 'Creating Ticket...'
                    : 'Create Ticket'}
                </Button>
              </div>

            </div>
          </div>

          {/* RIGHT */}
          <div
            className="
              hidden
              h-full
              lg:flex
              lg:flex-col
              rounded-3xl
              border border-zinc-200
              bg-white
              p-6
              shadow-sm

              dark:border-white/10
              dark:bg-gradient-to-b
              dark:from-zinc-900
              dark:to-black
            "
          >
            <div>
              <div
                className="
                  inline-flex
                  rounded-full
                  border border-violet-500/20
                  bg-violet-500/10
                  px-3 py-1
                  text-[11px]
                  text-violet-500

                  dark:text-violet-300
                "
              >
                SLA ENABLED
              </div>

              <h2
                className="
                  mt-5
                  text-4xl
                  font-bold
                  leading-tight
                "
              >
                Faster support.
                <br />
                Cleaner workflow.
              </h2>

              <p
                className="
                  mt-4
                  text-sm
                  leading-6
                  text-zinc-500

                  dark:text-zinc-400
                "
              >
                Tickets are routed
                automatically using
                SLA priority rules.
              </p>
            </div>

            <div className="mt-8 space-y-4">

              <div
                className="
                  rounded-2xl
                  border border-zinc-200
                  bg-zinc-50
                  p-5

                  dark:border-white/10
                  dark:bg-white/[0.03]
                "
              >
                <p className="text-xs text-zinc-500">
                  Avg. Response
                </p>

                <h3
                  className="
                    mt-2
                    text-3xl
                    font-bold
                  "
                >
                  &lt; 15 mins
                </h3>
              </div>

              <div
                className="
                  rounded-2xl
                  border border-zinc-200
                  bg-zinc-50
                  p-5

                  dark:border-white/10
                  dark:bg-white/[0.03]
                "
              >
                <p className="text-xs text-zinc-500">
                  SLA Monitoring
                </p>

                <h3
                  className="
                    mt-2
                    text-3xl
                    font-bold
                  "
                >
                  Active 24/7
                </h3>
              </div>

              <div
                className="
                  rounded-2xl
                  border border-violet-500/10
                  bg-violet-500/[0.06]
                  p-5
                "
              >
                <p className="text-xs text-zinc-500">
                  Auto Assignment
                </p>

                <h3
                  className="
                    mt-2
                    text-2xl
                    font-semibold
                    text-violet-500

                    dark:text-violet-300
                  "
                >
                  Enabled
                </h3>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}