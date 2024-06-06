import { Link } from "react-router-dom";
import Layout from "../layouts/Layout";

function Home() {
  return (
    <Layout>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Hello there</h1>
            <p className="py-6">
              Welcome to the class app. CLick the button below to get started
            </p>
            <button className="btn btn-primary">
              <Link to="/register">Get Started</Link>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
