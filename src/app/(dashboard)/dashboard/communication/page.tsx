/**
 * Email Communication Page
 *
 * Email management and inbox functionality with full email client interface.
 * Matches the reference design exactly.
 */

"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    AlertTriangle,
    Archive as ArchiveIcon,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    RefreshCw,
    ReplyAll,
    Star as StarIcon,
    StickyNote,
    Trash,
    X,
} from "lucide-react";

export default function CommunicationPage() {
	return (
		<div className="flex h-full w-full flex-col overflow-hidden rounded-xl bg-panelLight dark:bg-panelDark">
			<div className="flex flex-1 overflow-hidden min-h-0">
				{/* Email List Panel */}
				<div className="bg-panelLight dark:bg-panelDark mb-1 w-full md:w-[350px] lg:w-[400px] shadow-sm md:mr-[3px] md:rounded-2xl lg:h-full lg:shadow-sm flex flex-col border-r border-border/50">
					<div className="w-full h-full flex flex-col">
						<div className="sticky top-0 z-15 flex items-center justify-between gap-1.5 p-2 pb-0 transition-colors bg-panelLight dark:bg-panelDark">
							<div className="w-full">
								<div className="grid grid-cols-12 gap-2 mt-1">
									<div className="col-span-12 flex gap-2">
										<div className="relative flex-1">
											<Input
												type="search"
												placeholder="Search"
												className="h-8 pl-9 pr-20 border-input bg-white dark:bg-[#141414] dark:border-none"
											/>
											<svg
												width="10"
												height="10"
												viewBox="0 0 10 10"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
												className="absolute left-3 top-1/2 -translate-y-1/2 fill-[#71717A] dark:fill-[#6F6F6F]"
											>
												<path
													fillRule="evenodd"
													clipRule="evenodd"
													d="M6.81038 7.0756C6.18079 7.54011 5.40248 7.81466 4.56004 7.81466C2.46451 7.81466 0.765747 6.11589 0.765747 4.02037C0.765747 1.92484 2.46451 0.226074 4.56004 0.226074C6.65557 0.226074 8.35433 1.92484 8.35433 4.02037C8.35433 4.8628 8.07978 5.64112 7.61527 6.27071L9.70535 8.36078C9.92761 8.58305 9.92761 8.94341 9.70535 9.16568C9.48308 9.38794 9.12272 9.38794 8.90046 9.16568L6.81038 7.0756ZM7.21604 4.02037C7.21604 5.48724 6.02691 6.67637 4.56004 6.67637C3.09317 6.67637 1.90403 5.48724 1.90403 4.02037C1.90403 2.5535 3.09317 1.36436 4.56004 1.36436C6.02691 1.36436 7.21604 2.5535 7.21604 4.02037Z"
												/>
											</svg>
											<div className="absolute right-[0rem] top-1/2 -translate-y-1/2 flex items-center gap-1">
												<kbd className="pointer-events-none hidden h-7 select-none flex-row items-center gap-1 rounded-md border-none bg-muted px-2 font-medium leading-[0]! opacity-100 sm:flex dark:bg-[#262626] dark:text-[#929292]">
													<span className="h-min leading-[0.2]! mt-px text-lg">⌘ </span>
													<span className="h-min text-sm leading-[0.2]!"> K</span>
												</kbd>
											</div>
										</div>
										<Button
											variant="ghost"
											size="sm"
											className="h-8 px-2 border border-input bg-background hover:bg-accent/80 active:bg-accent transition-colors text-muted-foreground"
										>
											<span className="text-xs font-medium">Categories</span>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="lucide lucide-chevron-down text-muted-foreground h-2 w-2 transition-transform duration-200 rotate-0"
											>
												<path d="m6 9 6 6 6-6" />
											</svg>
										</Button>
										<Button
											variant="ghost"
											size="sm"
											className="col-span-1 h-8 px-2 py-2 md:h-8 md:px-2 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 aria-busy:cursor-progress hover:bg-accent hover:text-accent-foreground"
											title="Refresh"
										>
											<RefreshCw className="h-4 w-4 text-muted-foreground" />
										</Button>
									</div>
								</div>
							</div>
						</div>
						<div className="bg-[#006FFE] relative z-5 h-0.5 w-full transition-opacity opacity-0"></div>

						{/* Email Items */}
						<div className="relative z-1 flex-1 overflow-hidden pt-0 min-h-0">
							<div className="hide-link-indicator flex h-full w-full">
								<div className="flex flex-1 flex-col" id="mail-list-scroll">
									<ScrollArea className="scrollbar-none flex-1 overflow-x-hidden h-full">
										<div className="divide-y divide-border">
											{/* Email Item 1 */}
											<div className="select-none border-b md:my-1 md:border-none">
												<div
													data-thread-id="19aa7ecdeeeff69a"
													className="hover:bg-muted/50 group mx-1 flex cursor-pointer flex-col items-start rounded-lg py-2 px-2 text-left text-sm transition-all duration-200 hover:opacity-100 border-border bg-muted/30 opacity-100 relative group"
												>
													<div className="dark:bg-panelDark absolute right-2 z-50 flex -translate-y-1/2 items-center gap-1 rounded-xl border bg-white p-1 opacity-0 shadow-sm group-hover:opacity-100 top-[-1]">
														<Button
															variant="ghost"
															size="sm"
															className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 aria-busy:cursor-progress hover:bg-accent hover:text-accent-foreground h-6 w-6 overflow-visible [&_svg]:size-3.5"
														>
															<StarIcon className="h-4 w-4 fill-transparent stroke-[#9D9D9D] dark:stroke-[#9D9D9D]" />
														</Button>
														<Button
															variant="ghost"
															size="sm"
															className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 aria-busy:cursor-progress hover:bg-accent hover:text-accent-foreground h-6 w-6 [&_svg]:size-3.5"
														>
															<AlertTriangle className="fill-[#9D9D9D] h-3.5 w-3.5" />
														</Button>
														<Button
															variant="ghost"
															size="sm"
															className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 aria-busy:cursor-progress hover:bg-accent hover:text-accent-foreground h-6 w-6 [&_svg]:size-3.5"
														>
															<ArchiveIcon className="fill-[#9D9D9D] h-4 w-4" />
														</Button>
														<Button
															variant="ghost"
															size="sm"
															className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 aria-busy:cursor-progress hover:text-accent-foreground h-6 w-6 hover:bg-[#FDE4E9] dark:hover:bg-[#411D23] [&_svg]:size-3.5"
														>
															<Trash className="fill-[#F43F5E] h-4 w-4" />
														</Button>
													</div>
													<div className="relative flex w-full items-center justify-between gap-4 px-4">
														<Avatar className="h-8 w-8 shrink-0 border border-border">
															<AvatarFallback className="bg-white dark:bg-[#373737] text-[#9F9F9F] font-bold text-xs">
																M
															</AvatarFallback>
														</Avatar>
														<div className="flex w-full justify-between">
															<div className="w-full">
																<div className="flex w-full flex-row items-center justify-between">
																	<div className="flex flex-row items-center gap-[4px]">
																		<span className="font-medium text-md flex items-baseline gap-1 group-hover:opacity-100">
																			<div className="flex items-center gap-1">
																				<span className="line-clamp-1 overflow-hidden text-sm">
																					Marketing for Plumbers on Instagram
																				</span>
																			</div>
																		</span>
																	</div>
																	<p className="text-muted-foreground text-nowrap text-xs font-normal opacity-70 transition-opacity group-hover:opacity-100 dark:text-[#8C8C8C]">
																		2:38 PM
																	</p>
																</div>
																<div className="flex justify-between">
																	<p className="mt-1 line-clamp-1 w-[95%] min-w-0 overflow-hidden text-sm text-[#8C8C8C]">
																		marketingforplumber and 4 others started
																		following you
																	</p>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
											{/* More email items would go here (omitted for brevity but preserving structure) */}
										</div>
									</ScrollArea>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Email Details - Right Panel */}
				<div className="bg-panelLight dark:bg-panelDark mb-1 rounded-2xl shadow-sm lg:h-full flex flex-col min-w-0 flex-1">
					<div className="relative flex-1 min-h-0 flex flex-col">
						<div className="flex flex-col h-full rounded-xl flex-1 min-h-0">
							<div className="bg-panelLight dark:bg-panelDark relative flex flex-col overflow-hidden rounded-xl transition-all duration-300 h-full flex-1 min-h-0">
								{/* Email Header Toolbar */}
								<div className="sticky top-0 z-15 flex shrink-0 items-center justify-between gap-1.5 p-2 pb-0 transition-colors bg-panelLight dark:bg-panelDark">
									<div className="flex flex-1 items-center gap-2">
										<Button
											variant="ghost"
											size="sm"
											className="h-8 w-8 p-0 hover:bg-accent/80 active:bg-accent transition-colors"
										>
											<X className="h-4 w-4 text-muted-foreground" />
											<span className="sr-only">Close</span>
										</Button>
										<Separator
											orientation="vertical"
											className="h-4 bg-border/60"
										/>
										<div className="flex items-center gap-1">
											<Button
												variant="ghost"
												size="sm"
												className="h-8 w-8 p-0 hover:bg-accent/80 active:bg-accent transition-colors"
												title="Previous email"
											>
												<ChevronLeft className="h-4 w-4 text-muted-foreground" />
											</Button>
											<Button
												variant="ghost"
												size="sm"
												className="h-8 w-8 p-0 hover:bg-accent/80 active:bg-accent transition-colors"
												title="Next email"
											>
												<ChevronRight className="h-4 w-4 text-muted-foreground" />
											</Button>
										</div>
									</div>
									<div className="flex items-center gap-1">
										<Button
											variant="ghost"
											size="sm"
											className="h-8 px-2 hover:bg-accent/80 active:bg-accent transition-colors"
										>
											<ReplyAll className="h-4 w-4 mr-1.5 text-muted-foreground" />
											<span className="text-sm leading-none font-medium">
												Reply all
											</span>
										</Button>
										<Button
											variant="ghost"
											size="sm"
											className="h-8 w-8 p-0 hover:bg-accent/80 active:bg-accent transition-colors"
											title="Notes"
										>
											<StickyNote className="h-4 w-4 text-muted-foreground" />
											<span className="sr-only">Notes</span>
										</Button>
										<Button
											variant="ghost"
											size="sm"
											className="h-8 w-8 p-0 hover:bg-accent/80 active:bg-accent transition-colors"
											title="Star"
										>
											<StarIcon className="h-4 w-4 text-muted-foreground" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											className="h-8 w-8 p-0 hover:bg-accent/80 active:bg-accent transition-colors"
											title="Archive"
										>
											<ArchiveIcon className="h-4 w-4 text-muted-foreground" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											className="h-8 w-8 p-0 hover:bg-destructive/10 active:bg-destructive/15 transition-colors"
											title="Delete"
										>
											<Trash className="h-4 w-4 fill-destructive text-destructive" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											className="h-8 w-8 p-0 hover:bg-accent/80 active:bg-accent transition-colors"
											title="More options"
										>
											<MoreHorizontal className="h-4 w-4 text-muted-foreground" />
										</Button>
									</div>
								</div>

								{/* Empty State (or email content) */}
								<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
									<div className="relative overflow-hidden flex-1 h-full min-h-0 flex items-center justify-center">
										<div className="flex flex-col items-center justify-center gap-2 text-center">
											{/* Envelope Icon */}
											<svg
												width="200"
												height="200"
												viewBox="0 0 192 192"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<rect
													width="192"
													height="192"
													rx="96"
													fill="#141414"
													fillOpacity="0.25"
												/>
												<rect
													x="0.5"
													y="0.5"
													width="191"
													height="191"
													rx="95.5"
													stroke="white"
													strokeOpacity="0.15"
													strokeLinecap="round"
													strokeDasharray="10 10"
												/>
												<g opacity="0.5">
													<path
														d="M47.4356 56.7697C47.0746 52.6434 50.127 49.0056 54.2534 48.6446L127.972 42.1951C132.098 41.8341 135.736 44.8865 136.097 49.0129L143.592 134.686C143.953 138.812 140.901 142.45 136.775 142.811L63.0561 149.26C58.9297 149.621 55.292 146.569 54.931 142.442L47.4356 56.7697Z"
														fill="url(#paint0_linear_2689_12764)"
													/>
													<path
														d="M47.4356 56.7697C47.0746 52.6434 50.127 49.0056 54.2534 48.6446L127.972 42.1951C132.098 41.8341 135.736 44.8865 136.097 49.0129L143.592 134.686C143.953 138.812 140.901 142.45 136.775 142.811L63.0561 149.26C58.9297 149.621 55.292 146.569 54.931 142.442L47.4356 56.7697Z"
														stroke="url(#paint1_linear_2689_12764)"
														strokeLinecap="round"
													/>
												</g>
												<g>
													<g clipPath="url(#clip0_2689_12764)">
														<path
															d="M54.4317 48.9696C54.8167 44.5681 58.697 41.3122 63.0985 41.6972L136.817 48.1468C141.218 48.5318 144.474 52.4121 144.089 56.8136L136.594 142.486C136.209 146.888 132.328 150.144 127.927 149.759L54.2086 143.309C49.8071 142.924 46.5512 139.044 46.9363 134.642L54.4317 48.9696Z"
															fill="url(#paint2_linear_2689_12764)"
														/>
														<g clipPath="url(#clip1_2689_12764)">
															<path
																d="M64.63 52.8729C63.8048 52.8007 63.0772 53.4112 63.005 54.2365L62.9359 55.0264C62.9607 55.0377 62.9851 55.0505 63.0091 55.0647L69.3042 58.8128C69.5008 58.9299 69.74 58.9508 69.9539 58.8697L76.8043 56.2717C76.8302 56.2618 76.8564 56.2535 76.8826 56.2467L76.9517 55.4567C77.0239 54.6314 76.4135 53.9038 75.5882 53.8316L64.63 52.8729Z"
																fill="white"
																fillOpacity="0.3"
															/>
															<path
																d="M76.7379 57.9011L70.4858 60.2722C69.8441 60.5156 69.1265 60.4528 68.5369 60.1017L62.7912 56.6807L62.3949 61.2098C62.3227 62.0351 62.9332 62.7627 63.7585 62.8349L74.7166 63.7936C75.5419 63.8658 76.2694 63.2553 76.3416 62.43L76.7379 57.9011Z"
																fill="white"
																fillOpacity="0.3"
															/>
														</g>
														<path
															d="M59.2855 85.2807C59.466 83.2175 61.2848 81.6913 63.348 81.8718L113.158 86.2295C115.221 86.41 116.747 88.2289 116.567 90.2921C116.386 92.3553 114.567 93.8815 112.504 93.701L62.6944 89.3432C60.6312 89.1627 59.105 87.3438 59.2855 85.2807Z"
															fill="white"
															fillOpacity="0.1"
														/>
														<path
															d="M57.9349 100.722C58.1154 98.6589 59.9343 97.1327 61.9974 97.3132L128.244 103.109C130.308 103.29 131.834 105.108 131.653 107.172C131.473 109.235 129.654 110.761 127.591 110.58L61.3438 104.785C59.2806 104.604 57.7544 102.785 57.9349 100.722Z"
															fill="white"
															fillOpacity="0.075"
														/>
														<path
															d="M56.5833 116.163C56.7638 114.1 58.5827 112.574 60.6459 112.755L120.218 117.966C122.281 118.147 123.807 119.966 123.627 122.029C123.446 124.092 121.627 125.618 119.564 125.438L59.9922 120.226C57.929 120.046 56.4028 118.227 56.5833 116.163Z"
															fill="white"
															fillOpacity="0.05"
														/>
														<path
															d="M55.2327 131.603C55.4132 129.54 57.2321 128.014 59.2953 128.194L96.6526 131.462C98.7158 131.643 100.242 133.462 100.061 135.525C99.881 137.588 98.0621 139.114 95.9989 138.934L58.6416 135.665C56.5784 135.485 55.0522 133.666 55.2327 131.603Z"
															fill="white"
															fillOpacity="0.025"
														/>
													</g>
													<path
														d="M54.9298 49.0131C55.2908 44.8868 58.9285 41.8343 63.0549 42.1953L136.773 48.6449C140.9 49.0059 143.952 52.6436 143.591 56.77L136.096 142.443C135.735 146.569 132.097 149.622 127.971 149.261L54.2522 142.811C50.1258 142.45 47.0734 138.812 47.4344 134.686L54.9298 49.0131Z"
														stroke="url(#paint3_linear_2689_12764)"
														strokeLinecap="round"
													/>
												</g>
												<defs>
													<linearGradient
														id="paint0_linear_2689_12764"
														x1="91.069"
														y1="44.9217"
														x2="99.9589"
														y2="146.534"
														gradientUnits="userSpaceOnUse"
													>
														<stop stopColor="white" stopOpacity="0.1" />
														<stop offset="1" stopColor="white" stopOpacity="0.05" />
													</linearGradient>
													<linearGradient
														id="paint1_linear_2689_12764"
														x1="91.069"
														y1="44.9217"
														x2="99.9589"
														y2="146.534"
														gradientUnits="userSpaceOnUse"
													>
														<stop stopColor="white" stopOpacity="0.1" />
														<stop offset="1" stopColor="#323232" stopOpacity="0" />
													</linearGradient>
													<linearGradient
														id="paint2_linear_2689_12764"
														x1="99.9577"
														y1="44.922"
														x2="91.0678"
														y2="146.534"
														gradientUnits="userSpaceOnUse"
													>
														<stop stopColor="white" stopOpacity="0.1" />
														<stop offset="1" stopColor="white" stopOpacity="0.05" />
													</linearGradient>
													<linearGradient
														id="paint3_linear_2689_12764"
														x1="99.9577"
														y1="44.922"
														x2="91.0678"
														y2="146.534"
														gradientUnits="userSpaceOnUse"
													>
														<stop stopColor="white" stopOpacity="0.1" />
														<stop offset="1" stopColor="#323232" stopOpacity="0" />
													</linearGradient>
													<clipPath id="clip0_2689_12764">
														<path
															d="M54.4317 48.9696C54.8167 44.5681 58.697 41.3122 63.0985 41.6972L136.817 48.1468C141.218 48.5318 144.474 52.4121 144.089 56.8136L136.594 142.486C136.209 146.888 132.328 150.144 127.927 149.759L54.2086 143.309C49.8071 142.924 46.5512 139.044 46.9363 134.642L54.4317 48.9696Z"
															fill="white"
														/>
													</clipPath>
													<clipPath id="clip1_2689_12764">
														<rect
															width="16"
															height="16"
															fill="white"
															transform="translate(62.4014 49.666) rotate(5)"
														/>
													</clipPath>
												</defs>
											</svg>
											<div className="mt-4">
												<p className="text-lg">It's empty here</p>
												<p className="text-md text-muted-foreground dark:text-white/50">
													Choose an email to view details
												</p>
												<div className="mt-4 grid grid-cols-1 gap-2 xl:grid-cols-2">
													<Button
														variant="outline"
														size="sm"
														className="h-7 border bg-white dark:bg-[#313131] dark:border-none px-2"
													>
														<svg
															width="22"
															height="22"
															viewBox="0 0 22 22"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
															className="mr-1 h-3.5 w-3.5 fill-[#959595]"
														>
															<path
																fillRule="evenodd"
																clipRule="evenodd"
																d="M8 3.5C8.33486 3.5 8.62915 3.72198 8.72114 4.04396L9.53434 6.89015C9.89028 8.13593 10.8641 9.10972 12.1099 9.46566L14.956 10.2789C15.278 10.3709 15.5 10.6651 15.5 11C15.5 11.3349 15.278 11.6291 14.956 11.7211L12.1098 12.5343C10.8641 12.8903 9.89028 13.8641 9.53434 15.1099L8.72114 17.956C8.62915 18.278 8.33486 18.5 8 18.5C7.66514 18.5 7.37085 18.278 7.27886 17.956L6.46566 15.1099C6.10972 13.8641 5.13593 12.8903 3.89015 12.5343L1.04396 11.7211C0.721983 11.6291 0.5 11.3349 0.5 11C0.5 10.6651 0.721983 10.3709 1.04396 10.2789L3.89015 9.46566C5.13593 9.10972 6.10972 8.13593 6.46566 6.89015L7.27886 4.04396C7.37085 3.72198 7.66514 3.5 8 3.5Z"
																fill="var(--icon-color)"
																fillOpacity="0.5"
															/>
															<path
																fillRule="evenodd"
																clipRule="evenodd"
																d="M17 0.5C17.3442 0.5 17.6441 0.734223 17.7276 1.0681L17.9865 2.10356C18.2216 3.04406 18.9559 3.7784 19.8964 4.01353L20.9319 4.27239C21.2658 4.35586 21.5 4.65585 21.5 5C21.5 5.34415 21.2658 5.64414 20.9319 5.72761L19.8964 5.98647C18.9559 6.2216 18.2216 6.95594 17.9865 7.89644L17.7276 8.9319C17.6441 9.26578 17.3442 9.5 17 9.5C16.6558 9.5 16.3559 9.26578 16.2724 8.9319L16.0135 7.89644C15.7784 6.95594 15.0441 6.2216 14.1036 5.98647L13.0681 5.72761C12.7342 5.64414 12.5 5.34415 12.5 5C12.5 4.65585 12.7342 4.35586 13.0681 4.27239L14.1036 4.01353C15.0441 3.7784 15.7784 3.04406 16.0135 2.10356L16.2724 1.0681C16.3559 0.734223 16.6558 0.5 17 0.5Z"
																fill="var(--icon-color)"
																fillOpacity="0.5"
															/>
															<path
																fillRule="evenodd"
																clipRule="evenodd"
																d="M15.5 14C15.8228 14 16.1094 14.2066 16.2115 14.5128L16.6058 15.6956C16.7551 16.1435 17.1065 16.4949 17.5544 16.6442L18.7372 17.0385C19.0434 17.1406 19.25 17.4272 19.25 17.75C19.25 18.0728 19.0434 18.3594 18.7372 18.4615L17.5544 18.8558C17.1065 19.0051 16.7551 19.3565 16.6058 19.8044L16.2115 20.9872C16.1094 21.2934 15.8228 21.5 15.5 21.5C15.1772 21.5 14.8906 21.2934 14.7885 20.9872L14.3942 19.8044C14.2449 19.3565 13.8935 19.0051 13.4456 18.8558L12.2628 18.4615C11.9566 18.3594 11.75 18.0728 11.75 17.75C11.75 17.4272 11.9566 17.1406 12.2628 17.0385L13.4456 16.6442C13.8935 16.4949 14.2449 16.1435 14.3942 15.6956L14.7885 14.5128C14.8906 14.2066 15.1772 14 15.5 14Z"
																fill="var(--icon-color)"
																fillOpacity="0.5"
															/>
														</svg>
														<div className="flex items-center justify-center gap-2.5 px-0.5">
															<div className="text-sm leading-none">
																Zero chat
															</div>
														</div>
													</Button>
													<Button
														variant="outline"
														size="sm"
														className="h-7 border bg-white dark:bg-[#313131] dark:border-none px-2"
													>
														<svg
															width="14"
															height="16"
															viewBox="0 0 22 18"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
															className="mr-1 h-3.5 w-3.5 fill-[#959595]"
														>
															<path d="M0.5 5.6691V14.25C0.5 15.9069 1.84315 17.25 3.5 17.25H18.5C20.1569 17.25 21.5 15.9069 21.5 14.25V5.6691L12.5723 11.1631C11.6081 11.7564 10.3919 11.7564 9.42771 11.1631L0.5 5.6691Z" />
															<path d="M21.5 3.90783V3.75C21.5 2.09315 20.1569 0.75 18.5 0.75H3.5C1.84315 0.75 0.5 2.09315 0.5 3.75V3.90783L10.2139 9.88558C10.696 10.1823 11.304 10.1823 11.7861 9.88558L21.5 3.90783Z" />
														</svg>
														<div className="flex items-center justify-center gap-2.5 px-0.5">
															<div className="text-sm leading-none dark:text-foreground">
																Send email
															</div>
														</div>
													</Button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
