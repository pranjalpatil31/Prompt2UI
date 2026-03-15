"use client"
import React, { memo, useState } from 'react'
import PromptInput from '../../../components/prompt-input'
import {
  Wallet,
  Activity,
  Utensils,
  Plane,
  ShoppingBag,
  Brain,
  ListTodo,
  GraduationCap,
  Music,
  MessageCircle,
  Map,
  Camera,
  FolderOpenDotIcon
} from "lucide-react";
import { Suggestion, Suggestions } from '../../../components/ai-elements/suggestion';
import Header from './header';
import { useCreateProject, useGetProjects } from '../../../features/use-project';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { Spinner } from '../../../components/ui/spinner';
import type { ProjectType } from '../../../types/project';
import { useRouter } from 'next/dist/client/components/navigation';
import { formatDistanceToNow } from 'date-fns';

const LandingSection = () => {
  const { user } = useKindeBrowserClient();
  const [promptText, setPromptText] = useState<string>("");
  const userId = user?.id;

  const { data: projects, isLoading, isError } = useGetProjects(userId);

  const { mutate, isPending } = useCreateProject();

  const suggestions = [
    {
      label: "Finance Tracker",
      icon: Wallet,
      value: `Finance app statistics screen. Current balance displayed at the top with large currency amount. Bar chart showing spending across months (Oct–Mar) with selectable month pills below the chart. Transaction history list with small app icons, transaction titles, amounts, and spending categories. Bottom navigation bar with dashboard, analytics, and profile icons. Mobile app, single screen. Style: Light mode with bold colorful accents. Dark gray background cards, chunky rounded components, no gradients, playful yet professional interface, modern sans-serif typography with a Gen Z fintech aesthetic.`,
    },

    {
      label: "Fitness Activity",
      icon: Activity,
      value: `Fitness tracker summary screen. Large circular progress ring in the center showing steps and calories burned with neon glow highlight. Line graph displaying heart rate trends across the day. Bottom section grid with health metrics including Sleep hours, Water intake, and SpO2 levels. Bottom navigation bar with activity, stats, and profile icons. Mobile app, single screen. Style: Deep dark mode interface with OLED-friendly pitch black background. Neon green and electric blue accents with high contrast data visualization, sleek and sporty health tech aesthetic.`,
    },

    {
      label: "Food Delivery",
      icon: Utensils,
      value: `Food delivery home feed screen. Top search bar with location pin and filter icon. Horizontal hero carousel displaying daily deals and promotional restaurant banners. Vertical list of restaurants with large food thumbnails, delivery time badges, rating stars, and cuisine tags. Floating Action Button (FAB) for cart access in bottom corner. Category chips for pizza, burgers, sushi, and desserts. Mobile app, single screen. Style: Vibrant and appetizing design with warm orange, red, and yellow color palette. Rounded card corners, subtle drop shadows for depth, friendly modern UI.`,
    },

    {
      label: "Travel Booking",
      icon: Plane,
      value: `Travel destination detail screen. Full screen immersive photograph of a tropical beach destination. Bottom sheet overlay with rounded corners displaying hotel title, star rating, short description, price per night, and large “Book Now” button. Horizontal scroll row of amenity icons such as WiFi, pool, breakfast, and airport transfer. Image gallery thumbnails for more photos. Mobile app, single screen. Style: Minimalist luxury design with generous whitespace, elegant serif headings, clean sans-serif body text, sophisticated high-end travel experience.`,
    },

    {
      label: "E-Commerce",
      icon: ShoppingBag,
      value: `Sneaker product detail page. Large high resolution product image centered on light gray background. Color selector swatches and size selection grid below product title. Price displayed in bold oversized typography. Sticky “Add to Cart” button fixed at the bottom. Product description and ratings section underneath. Mobile app, single screen. Style: Neo-brutalism inspired UI with thick black outlines around buttons and cards, hard shadows with no blur, bold solid colors like yellow and black, trendy streetwear aesthetic.`,
    },

    {
      label: "Meditation",
      icon: Brain,
      value: `Meditation player screen. Central focus on a soft breathing bubble animation that expands and contracts to guide breathing. Minimal playback controls including play, pause, and session time slider below. Background uses calming pastel sage green tone. Section for recommended meditation sessions such as Sleep Calm, Stress Relief, and Focus. Mobile app, single screen. Style: Soft minimal interface with rounded corners, pastel color palette, low contrast text for relaxation, minimal UI clutter creating a peaceful and therapeutic atmosphere.`,
    },

    {
      label: "Task Manager",
      icon: ListTodo,
      value: `Task management dashboard screen. List of today's tasks with checkboxes, priority tags, and due time indicators. Progress bar at the top showing percentage of tasks completed today. Section for upcoming tasks and reminders. Floating action button to add a new task quickly. Bottom navigation bar with tasks, calendar, projects, and profile icons. Mobile app, single screen. Style: Clean productivity design with white background, soft blue accent colors, minimal card layout, modern sans-serif typography focused on clarity and organization.`,
    },

    {
      label: "Online Learning",
      icon: GraduationCap,
      value: `Online learning dashboard screen. Greeting header with user progress summary and learning streak indicator. Horizontal cards displaying enrolled courses with thumbnails and progress bars. Section for recommended courses with ratings and enrollment numbers. Bottom navigation bar with home, courses, certificates, and profile icons. Mobile app, single screen. Style: Educational interface with soft gradients, rounded cards, friendly typography, calm blue and purple color palette creating an encouraging learning environment.`,
    },

    {
      label: "Music Streaming",
      icon: Music,
      value: `Music streaming player screen. Large album artwork centered on the screen with blurred background effect. Song title, artist name, and playback progress slider underneath. Playback controls including play, pause, next, previous, and shuffle buttons. Suggested playlists displayed in scrollable cards at the bottom. Mobile app, single screen. Style: Dark modern interface inspired by music streaming platforms with deep black background, vibrant accent colors, smooth gradients, and elegant minimal typography.`,
    },

    {
      label: "Messaging Chat",
      icon: MessageCircle,
      value: `Messaging app conversation list screen. Contact avatars on the left with names and preview of recent messages. Time stamps aligned to the right and unread message badges. Floating button to start a new chat. Chat screen layout with rounded message bubbles, typing indicator animation, and input bar with emoji and attachment icons. Mobile app, single screen. Style: Clean communication UI with soft blue accents, minimal layout, and highly readable typography.`,
    },

    {
      label: "Navigation Map",
      icon: Map,
      value: `Navigation map screen showing real-time route guidance. Large interactive map with highlighted route line and start/end location markers. Bottom panel displaying estimated travel time, distance, and turn-by-turn directions. Floating buttons for zoom, voice navigation, and current location. Mobile app, single screen. Style: Clean map-based interface with minimal overlays, bright route colors, and modern navigation UI similar to contemporary GPS apps.`,
    },

    {
      label: "Photo Gallery",
      icon: Camera,
      value: `Photo gallery app home screen displaying a grid layout of user photos with rounded thumbnails. Top bar with search and album filter options. Featured memories carousel highlighting selected photos. Bottom navigation bar with photos, albums, search, and profile sections. Mobile app, single screen. Style: Minimal and elegant interface with white background, soft shadows, modern typography, and focus on visual content.`,
    },
  ];

  const handleSuggestionClick = (value: string) => {
    setPromptText(value);
  };

  const handleSubmit = () => {
    if (!promptText) return;
    mutate(promptText);
  };

  // return (
  //   <div className="w-fullmin-h-screen ">
  //     <div className="flex flex-col">
  //       <Header />
  //       <div className="relative overflow-hidden pt-28">
  //         <div className="max-w-6xl mx-auto flex flex-col items-center justify-center">
  //           <div className="space-y-3">
  //             <h1 className="text-center font-semibold text-4xl tracking-tight sm:text-5xl">
  //               Prompt2UI – Turn Your Ideas into Mobile UI Designs with AI <br className="md:hidden" />
  //               <span className="text-primary">Prompt. Generate. Design. Instantly.</span>
  //             </h1>
  //             <p className="mx-auto max-w-2xl test-center font-medium test-foreground leading-relaxed sm:text-lg">
  //               With Prompt2UI, users can turn their ideas into mobile UI designs by simply describing them in text. The system automatically generates visually organized layouts on an interactive canvas.
  //             </p>
  //           </div>
  //           <div className="flex w-full max-w-3xl flex-col item-center gap-8 relative z-50">
  //             <div className="w-full">
  //               <PromptInput
  //                 className="ring-2 ring-primary rounded-3xl"
  //                 promptText={promptText}
  //                 setPromptText={setPromptText}
  //                 isLoading={false}
  //                 onSubmit={() => { }}
  //               />
  //             </div>
  //             <div className="flex flex-wrap justify-center gap-2 px-5">
  //               <Suggestions>
  //                 {suggestions.map((s) => (
  //                   <Suggestion
  //                     key={s.label}
  //                     suggestion={s.label}
  //                     className="text-xs! h-7! px-2.5 pt-1!"
  //                     onClick={() => handleSuggestionClick(s.value)}
  //                   >
  //                     <s.icon className="size-3 mr-1" />
  //                     <span>{s.label}</span>
  //                   </Suggestion>
  //                 ))}
  //               </Suggestions>
  //             </div>
  //           </div>
  //           <div className="absolute-translate-x-1/2 left-1/2 w-1250 h-750 top-[80%] -z-10">
  //             <div className="-translate-x-1/2 absolute bottom-[calc(100%-300px)] left-1/2 h-500 w-500 opacity-20 bg-radial-primary"></div>
  //             <div className="absolute -mt-2.5 size-full rounded-[50%] bg-primary/20 opacity-70 [box-shadow:0_-15px_24.8px_var(--primary)]"></div>
  //             <div className="absolute z-0 size-full rounded-[50%] bg-background"></div>
  //           </div>
  //         </div>
  //       </div>
  //       <div className="w-full py-10">
  //         <div className="mx-auto max-w-3xl">
  //           <div>
  //             <h1 className="font-medium text-xl tracking-tight">
  //               Your Generated Interfaces
  //             </h1>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // )

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="flex flex-col">

        <Header />

        {/* HERO */}
        <section className="relative overflow-hidden pt-24 pb-16">

          {/* Background glow */}
          {/* Animated Background */}
          <div className="absolute inset-0 -z-10 overflow-hidden">

            {/* center glow */}
            <div className="absolute left-1/2 top-32 -translate-x-1/2 h-130 w-130 rounded-full bg-primary/30 blur-[140px] animate-pulse"></div>

            {/* floating shape 1 */}
            <div className="absolute top-10 left-10 h-55 w-55 rounded-full bg-purple-400/30 blur-[110px] animate-float"></div>

            {/* floating shape 2 */}
            <div className="absolute bottom-0 right-10 h-65 w-65 rounded-full bg-pink-400/20 blur-[120px] animate-float-slow"></div>

          </div>

          <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">

            {/* Heading */}
            <div className="space-y-6 text-center max-w-3xl">

              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
                Turn Your Ideas Into
                <span className="block bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                  Mobile UI Designs with AI
                </span>
              </h1>

              <p className="text-muted-foreground text-lg leading-relaxed">
                Prompt2UI lets you generate beautiful mobile interfaces simply by
                describing them in text. Instantly transform your ideas into
                structured UI layouts powered by AI.
              </p>

            </div>

            {/* Prompt box */}
            <div className="w-full max-w-3xl mt-10">

              <div className="rounded-3xl border bg-background/70 backdrop-blur-lg shadow-[0_0_40px_rgba(124,58,237,0.15)] p-3 hover:shadow-[0_0_60px_rgba(124,58,237,0.35)] transition">

                <PromptInput
                  className="rounded-2xl"
                  promptText={promptText}
                  setPromptText={setPromptText}
                  isLoading={isPending}
                  onSubmit={handleSubmit}
                />

              </div>

            </div>

            {/* Suggestions */}
            <div className="mt-8 flex flex-wrap justify-center gap-3 max-w-3xl">

              <Suggestions>
                {suggestions.map((s) => (
                  <Suggestion
                    key={s.label}
                    suggestion={s.label}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border bg-muted hover:bg-primary hover:text-white transition-all duration-200"
                    onClick={() => handleSuggestionClick(s.value)}
                  >
                    <s.icon className="size-3" />
                    <span>{s.label}</span>
                  </Suggestion>
                ))}
              </Suggestions>

            </div>

          </div>

        </section>

        <section className="w-full py-16 border-t">
          <div className="max-w-5xl mx-auto px-4">

            {userId && (
              <>
                <h2 className="text-2xl font-semibold tracking-tight mb-6">
                  Your Generated Interfaces
                </h2>

                {isLoading ? (
                  <div className="flex items-center justify-center py-2">
                    <Spinner className="size-10" />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                      {projects?.map((project: ProjectType) => (
                        <ProjectCard key={project.id} project={project} />
                      ))}
                    </div>

                  </>
                )}
                {isError && <p className="text-red-500 text-center mt-4">Failed to load your projects. Please try again later.</p>}
              </>
            )}

          </div>
        </section>

      </div>
    </div>
  )
};

const ProjectCard = memo(({ project }: { project: ProjectType }) => {
  const router = useRouter();
  const createdAtDate = new Date(project.createdAt);
  const timeAgo = formatDistanceToNow(createdAtDate, { addSuffix: true });
  const thumbnail = project.thumbnail || null;
  const onRoute = () => {
    router.push(`/project/${project.id}`);
  }
  return (
    <div
      role="button"
      className="w-full flex flex-col border rounded-xl cursor-pointer hover:shadow-md overflow-hidden"
      onClick={onRoute}
    >
      <div
        className="h-40 bg-[#eee] relative overflow-hidden flex items-center justify-center">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={project.name}
            className="w-full h-full object-cover object-left scale-110"
          />

        ) : (
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <FolderOpenDotIcon />
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col">
        <h3 className="font-semibold text-sm truncate w-full mb-1 line-clamp-1">{project.name}</h3>
        <p className="text-xs text-muted-foreground">{timeAgo}</p>
      </div>
    </div>
  )
});

ProjectCard.displayName = "ProjectCard";

export default LandingSection;
