import { UAParser } from "ua-parser-js";
import supabase from "./supabase";

export async function getClicksForUrls(urlIds) {
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .in("url_id", urlIds);

  if (error) {
    console.log(error.message);
    throw new Error("Unable to load Cliks");
  }

  return data;
}

const parser = new UAParser();

export const storeClicks = async ({ id, original_url }) => {
  try {
    const res = parser.getResult();
    const device = res.type || "desktop";
    const response = await fetch("http://ipapi.co/json");
    const { city, country_name: country } = await response.json();

    await supabase.from("clicks").insert({
      url_id: id,
      city: city,
      country: country,
      device: device,
    });
    window.location.href = original_url;
  } catch (error) {
    console.error(error.message);
    throw new Error("unable to load clicks ");
  }
};

export async function getClicksForUrl(url_id) {
  console.log(url_id);
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .eq("url_id", url_id);
  console.log(data);

  if (error) {
    console.error(error.message);
    throw new Error("Unable to load stats");
  }
  return data;
}
