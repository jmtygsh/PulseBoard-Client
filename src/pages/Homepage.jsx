import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const Homepage = () => {
    return (
        <>
            <section className="flex justify-center items-center h-screen container mx-auto px-6 shadow-none">
                <div className="space-y-6">

                    <h1 className="text-3xl sm:text-5xl xl:text-6xl font-bold text-center
                bg-linear-to-r from-slate-50 to-orange-500 bg-clip-text text-transparent">
                        PulseBoard: Live Polls For Feedback
                    </h1>
                    <p className="text-md sm:text-lg text-center ">
                        Create, share, and vote on live polls to gather feedback from your audience.
                    </p>


                    <div className="flex justify-center mt-8 gap-4">
                        <Button variant="outline" asChild className="text-black hover:opacity-80 cursor-pointer shadow-xl">
                            <Link to="/create-poll">
                                Create New Poll
                            </Link>
                        </Button>

                        <Button variant="outline" asChild className="text-black hover:opacity-80 cursor-pointer shadow-xl">
                            <Link to="/dashboard">
                                Go to Dashboard
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            <section>

            </section>
        </>
    );
};

export default Homepage;