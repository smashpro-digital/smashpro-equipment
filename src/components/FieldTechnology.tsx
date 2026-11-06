import { EquipmentFeatureShowcase, type EquipmentFeatureShowcaseProps } from './EquipmentFeatureShowcase';

export function FieldTechnology() {
  const showcase: EquipmentFeatureShowcaseProps = {
    id: "field-technology",
    eyebrow: "Field Technology & Creator Gear",
    manufacturer: "AKASO",
    model: "360",
    status: "Exploring",
    headline: "Capture\nEvery Angle.",
    description: "We're exploring the AKASO 360 to document real-world equipment operations, attachment demonstrations, and behind-the-scenes field work.",
    image: {
      src: "https://www.awin1.com/cshow.php?s=4587303&v=69454&q=542867&r=3121518",
      alt: "AKASO 360 action camera, front and rear views. Your First 360 Action Cam.",
      caption: "Official AKASO product imagery",
      width: 2160,
      height: 2700,
    },
    features: ["Equipment in action", "Attachment demonstrations", "Behind the scenes"],
    actions: [
      { label: "Explore AKASO 360", href: "", variant: "primary", external: true, sponsored: true },
      { label: "Watch SmashPro Equipment", href: "https://www.youtube.com/@SmashProHQ", variant: "secondary", external: true },
      { label: "Explore the camera passport", href: "/equipment/sp-med-cam-001.html", variant: "secondary" },
    ],
    disclosure: "SmashPro participates in the AKASO Affiliate Program.",
    layout: "image-left",
    theme: "green",
    statusDetail: "Exploration stage. Visit the camera passport for its current commissioning status and approved field footage.",
    feed: {
      url: "/dashboard/api/public_gear.php?property=hq&placement=equipment.field-technology.akaso360",
      placement: "equipment.field-technology.akaso360",
      product: "AKASO 360",
      advertiserId: "69454",
      publisherId: "3121518",
      destination: "https://shopakaso.com/products/akaso-360?variant=44081902846134",
      creativeId: "4587303",
      imageUrl: "https://www.awin1.com/cshow.php?s=4587303&v=69454&q=542867&r=3121518",
      imageWidth: 2160,
      imageHeight: 2700,
    },
    feedActionIndex: 0,
    requireFeed: true,
  };

  return <EquipmentFeatureShowcase {...showcase} />;
}
